#!/bin/bash

while [ "$(curl -s -o /dev/null -w "%{http_code}" http://vault:8200/v1/sys/health?standbyok=true)" -ne 200 ]; 
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

sleep 5
echo "Applying database migrations..."
python website/backend/manage.py makemigrations
sleep 5
python website/backend/manage.py migrate
sleep 5
echo "Starting Django server..."
python website/backend/manage.py runserver 0.0.0.0:8000