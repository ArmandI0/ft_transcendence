#!/bin/bash

file=$1
vault_secret_dir=$2
var_group=$3
var_list=""

if [ -z "$file" ] || [ -z "$vault_secret_dir" ] || [ -z "$var_group" ]; then
    echo "Usage: $0 <env_file> <vault_secret_dir> <env var group> ex: .env api42 API42"
    exit 1
fi

while IFS= read -r line || [ -n "$line" ]; do
	if [[ "$line" =~ ^[A-Za-z_][A-Za-z0-9_]*= ]] && echo "$line" | grep -q "$var_group"; then
        var_name=$(echo "$line" | cut -d '=' -f 1)
        var_value=$(echo "$line" | cut -d '=' -f 2-)
		var_list+=$var_name=$var_value
		var_list+=" "
    fi
done < "$file"
echo "docker exec vault vault kv put secret/$vault_secret_dir $var_list" > /dev/null
docker exec vault vault kv put secret/$vault_secret_dir $var_list > /dev/null
