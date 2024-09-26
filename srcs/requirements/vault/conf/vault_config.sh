#!/bin/bash

vault server -config=/vault/config/vault.hcl &
VAULT_PID=$!


echo "Waiting for Vault to become available..."
sleep 10
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8200/v1/sys/health?standbyok=true)

if [ "$response" -eq 503 ]; then
	echo "XXXXXX VAULT AVAILABLE AND SEALED XXXXX"
	vault operator unseal $VAULT_KEY1
	echo -e "\033[1;94munseal 1/3\033[0m"
	vault operator unseal $VAULT_KEY2
	echo -e "\033[1;94munseal 2/3\033[0m"
	vault operator unseal $VAULT_KEY3
	echo -e "\033[1;94munseal 3/3\033[0m"
	vault login $VAULT_ROOT_TOKEN
	echo -e "\033[1;94mlogged\033[0m"
	
else
	echo "Status vault : $response"
fi

wait $VAULT_PID