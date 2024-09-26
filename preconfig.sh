#!/bin/bash

mkdir -p postgres_data

if [ ! -d "vault_data" ];then
	mkdir vault_data
	docker build -t vault:latest ./srcs/requirements/vault/.
	docker run -d \
	--name vault \
	--cap-add IPC_LOCK \
	-p 8200:8200 \
	-v ./vault_data:/vault/data \
	vault > /dev/null
	sleep 3
	docker exec vault vault operator init | grep -e "Unseal Key" -e "Initial Root Token" > keys.txt
	sed -i -e 's/: /=/g' -e 's/Unseal Key /VAULT_KEY/g' -e 's/Initial Root Token/VAULT_ROOT_TOKEN/g' keys.txt
	mv keys.txt ./srcs/secrets/.vault_tokens
    
	echo "----------"
	echo -e "\033[0;31mpreconfiguration of vault policies and creation of app tokens..."
	bash ./srcs/requirements/vault/conf/vault_config_rules.sh > /dev/null
	echo -e "\033[0;32mpreconfiguration of vault finished !\033[0m"
	echo "----------"

	docker stop vault > /dev/null
	docker rm vault > /dev/null
fi
