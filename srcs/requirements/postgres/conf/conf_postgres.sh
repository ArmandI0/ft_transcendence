#!/bin/bash
while [ "$(curl -s -o /dev/null -w "%{http_code}" $VAULT_URL/v1/sys/health?standbyok=true)" -ne 200 ]; 
do sleep 1; 
done

secrets=$(curl -s --header "X-Vault-Token: $POSTGRES_VAULT_TOKEN" "$VAULT_URL/v1/secret/postgres_data")

if [[ $(echo "$secrets" | jq -r '.data') == "null" ]]; then
  echo "Error when getting secrets from Vault"
  exit 1
fi

for name in $(echo "$secrets" | jq -r '.data | keys[]'); do
    value=$(echo "$secrets" | jq -r ".data[\"$name\"]")
    export "$name"="$value"
done
env
exec bash /usr/local/bin/docker-entrypoint.sh postgres

# while true; do
#   sleep 1  # Attendre 1 seconde avant de recommencer
# done
