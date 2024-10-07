import requests
from django.conf import settings
from .models import Api42User

def addUser(data):
	newUser = Api42User(
		login42 = data.get("login"),
		username = data.get("login"),
		first_name = data.get("first_name"),
		last_name = data.get("last_name"),
		email = data.get("email"),
		password = None
	)
	newUser.full_clean()
	newUser.save()
	return newUser

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
		print("BORDEL DE MERDE !!!!!!! ")
		return secret_data, response.status_code
