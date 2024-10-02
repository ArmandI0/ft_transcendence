#!/bin/bash
if [ ! -f ./.config_ok ]; then
	echo -e "\033[0;31mPostconfiguration started..."

	if [ -f ./srcs/secrets/.env ]; then
		export $(grep -v '^#' ./srcs/secrets/.env | xargs)
	fi

	sleep 5
	docker exec postgres psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE ROLE \"$VAULT_USER_DB\" WITH SUPERUSER LOGIN ENCRYPTED PASSWORD '$VAULT_PSWD_DB';"\
		> /dev/null


	while [ "$(docker exec vault curl -s -o /dev/null -w "%{http_code}" http://vault:8200/v1/sys/health?standbyok=true)" -ne 200 ]; 
	do sleep 1; 
	done

	docker exec vault vault secrets enable database \
		> /dev/null

	docker exec vault vault write database/config/postgres \
		plugin_name=postgresql-database-plugin \
		allowed_roles="dbuser_ro,dbuser_wo"\
		connection_url="postgresql://{{username}}:{{password}}@postgres:5432/postgres" \
		username=$VAULT_USER_DB \
		password=$VAULT_PSWD_DB \
		> /dev/null

	docker exec vault vault write database/roles/dbuser_ro \
		db_name="postgres" \
		max_ttl="10m" \
		creation_statements="CREATE USER \"{{name}}\" WITH ENCRYPTED PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT ALL SELECT ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO \"{{name}}\";" \
		revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \"{{name}}\"; DROP USER \"{{name}}\";" \
		> /dev/null

	docker exec vault vault write database/roles/dbuser_wo \
		db_name="postgres" \
		max_ttl="10m" \
		creation_statements="CREATE USER \"{{name}}\" WITH ENCRYPTED PASSWORD '{{password}}' VALID UNTIL '{{expiration}}'; GRANT INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO \"{{name}}\"; ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT INSERT, UPDATE, DELETE ON TABLES TO \"{{name}}\";" \
		revocation_statements="REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM \"{{name}}\"; DROP USER \"{{name}}\";" \
		> /dev/null

	docker exec vault vault secrets enable -path=secret kv \
		> /dev/null

	docker exec vault vault kv put secret/api42 client_id=$API42_UID \
		client_secret=$API42_PASS \
		> /dev/null

	touch .config_ok
	echo -e "\033[0;32mPostconfiguration finished !\033[0m"
else 
	echo "Already configured"
fi
docker exec apache cat /cert/localhost.crt > srcs/secrets/localhost.crt
docker exec apache cat /cert/localhost.key > srcs/secrets/localhost.key
if [ "$(curl --cacert srcs/secrets/localhost.crt -s -o /dev/null -w "%{http_code}" https://localhost)" -ne 200 ]; then

	echo -e "\033[0;31mWaiting for website to be available..."
	while [ "$(curl --cacert srcs/secrets/localhost.crt -s -o /dev/null -w "%{http_code}" https://localhost)" -ne 200 ]; 
	do sleep 1; 
	done
fi
echo -e "\033[0;32mWebsite available !\033[0m"