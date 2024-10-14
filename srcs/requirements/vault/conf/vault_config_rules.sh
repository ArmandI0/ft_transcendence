#!/bin/bash	
	
export $(grep -v '^#' ./srcs/secrets/.vault_tokens | xargs) > /dev/null
export $(grep -v '^#' ./srcs/secrets/.env | grep "VAULT_URL" | xargs) > /dev/null
docker exec vault vault operator unseal $VAULT_KEY1 > /dev/null
docker exec vault vault operator unseal $VAULT_KEY2 > /dev/null
docker exec vault vault operator unseal $VAULT_KEY3 > /dev/null
docker exec vault vault login $VAULT_ROOT_TOKEN > /dev/null

docker exec vault vault policy write django_policy /conf/django_policy.hcl 
docker exec vault vault token create -policy=django_policy -orphan -ttl=24h | grep "token " > ./django_token.txt
sed -i -e 's/ //g' -e 's/token/DJANGO_VAULT_TOKEN=/g' django_token.txt
echo "VAULT_URL=$VAULT_URL" >> django_token.txt
mv django_token.txt ./srcs/secrets/.django_token
echo ".django_token created"

docker exec vault vault policy write postgres_policy /conf/postgres_policy.hcl 
docker exec vault vault token create -policy=postgres_policy -orphan -ttl=24h | grep "token " > ./postgres_token.txt
sed -i -e 's/ //g' -e 's/token/POSTGRES_VAULT_TOKEN=/g' postgres_token.txt
echo "VAULT_URL=$VAULT_URL" >> postgres_token.txt
mv postgres_token.txt ./srcs/secrets/.postgres_token
echo ".postgres_token created"

docker exec vault vault secrets enable -path=secret kv \
	> /dev/null

bash ./srcs/requirements/vault/conf/send_env.sh "./srcs/secrets/.env" "api42" "API42_"\
	&& bash ./srcs/requirements/vault/conf/send_env.sh "./srcs/secrets/.env" "postgres_data" "POSTGRES_"\
	> /dev/null
echo "Env send to vault"