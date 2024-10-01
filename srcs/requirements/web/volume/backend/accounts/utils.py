import requests
from django.conf import settings

def get_api42_cred_vault ():
	vault_url = settings.VAULT_URL
	secret_path='secret/api42'
	token = settings.DJANGO_VAULT_TOKEN
	if not token:
		print("Vault token is not set in settings.")
		return None, 401

	headers = {
		"X-Vault-Token": token,
	}
	response = requests.get(f"{vault_url}/v1/{secret_path}", headers=headers)
	if response.status_code == 200:
		secret_data = response.json()
		return secret_data, 200
	else:
		secret_data = None
		return secret_data, response.status_code
	
def get_postgres_cred_dbuser_wo():
	vault_url = settings.VAULT_URL
	path='database/creds/dbuser_wo'
	token = settings.DJANGO_VAULT_TOKEN
	if not token:
		print("Vault token is not set in settings.")
		return None, 401
	headers = {
		"X-Vault-Token": token,
	}
	response = requests.get(f"{vault_url}/v1/{path}", headers=headers)
	if response.status_code == 200:
		secret_data = response.json()
		return secret_data, 200
	else:
		print("Vault request error:", response.status_code, response.text)
		secret_data = None
		return secret_data, response.status_code