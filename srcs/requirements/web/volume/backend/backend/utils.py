import requests
from django.conf import settings
from django.db import connections
from datetime import datetime ,timedelta

class VaultToken:
    def __init__(self):
        self.username = None
        self.password = None
        self.deliveryTime = datetime.now()

    def tokenIsValid(self)-> bool:
        timeToExpire = timedelta(minutes=9.8)
        if ( datetime.now() - self.deliveryTime < timeToExpire) and (self.username != None or self.password != None):
            return True
        else:
            return False

    def tokenRequest(self)-> bool:
        token, status = get_postgres_cred_dbuser_wo()
        if token:
            self.username = token['data']['username']
            self.password = token['data']['password']

            print("**************************")
            print(self.username)
            print(self.password)
            print("**************************")
            return True
        else:
            print("Error :" + status)
            return False
    
    def getAccessToDb(self):
        if self.tokenIsValid():
            return True
        else:
            if self.tokenRequest():
                configure_database(self.username, self.password)
                return True
            else:
                return False
    
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
        print("MSGError:", response.status_code, response.text)
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

