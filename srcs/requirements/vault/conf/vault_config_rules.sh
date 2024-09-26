#!/bin/bash	
	
export $(grep -v '^#' ./srcs/secrets/.vault_tokens | xargs) > /dev/null
docker exec vault vault operator unseal $VAULT_KEY1 > /dev/null
docker exec vault vault operator unseal $VAULT_KEY2 > /dev/null
docker exec vault vault operator unseal $VAULT_KEY3 > /dev/null
docker exec vault vault login $VAULT_ROOT_TOKEN > /dev/null

docker exec vault vault policy write django_policy /conf/django_policy.hcl 
docker exec vault vault token create -policy=django_policy -orphan -ttl=24h | grep "token " > ./django_token.txt
sed -i -e 's/ //g' -e 's/token/DJANGO_VAULT_TOKEN=/g' django_token.txt
mv django_token.txt ./srcs/secrets/.django_token