import requests
from django.conf import settings
from django.db import connections

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
        print("MSGError:", response.status_code, response.text)  # Afficher le message d'erreur
        secret_data = None
        return secret_data, response.status_code
    
def configure_database(dbuser, passwd):
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'nom_de_la_base_de_donnees',
        'USER': dbuser,
        'PASSWORD': passwd,
        'HOST': 'localhost',
        'PORT': '5432',
    }
    connections['default'].close()