from django.contrib.auth import authenticate , login, logout
from django.http import JsonResponse, HttpResponseBadRequest
import logging
import requests
from .utils import get_api42_cred_vault , addUser
from .models import Api42User

logger = logging.getLogger(__name__)


def get42UserData(request, response):
	try:
		json_data = response.json()
		access_token = json_data.get('access_token')
		url = 'https://api.intra.42.fr/v2/me'
		headers = {
			'Authorization': f'Bearer {access_token}'
		}
		response = requests.get(url, headers=headers)
		user_data = response.json()
		log = user_data.get("login")
		if Api42User.objects.filter(login42=log).exists():
			user = Api42User.objects.get(login42=log)
		else:
			user = addUser(user_data)
		login(request ,user)
		print('user_created')
		return JsonResponse(user_data)
	except ValueError:
		return JsonResponse({'error': 'Failed to retrieve token', 'details': response.json()}, status=response.status_code)



def api42_request(request) :
	if request.method == 'GET':
		code = request.GET.get('code')
		url = 'https://api.intra.42.fr/oauth/token'

		secret_data, status = get_api42_cred_vault()
		uid = secret_data['data']['API42_UID']
		passwd = secret_data['data']['API42_PASS']

		data = {
			"grant_type": "authorization_code",
			'client_id': uid,
			'client_secret': passwd,
			'code': code,
			'redirect_uri': 'https://localhost'
		}
		headers = {"Content-Type": "application/json; charset=utf-8"}
		response = requests.post(url, headers=headers, json=data)
		if response.status_code != 200:
			print(f"Erreur lors de la récupération des données utilisateur: {response.status_code}, Détails: {response.text}")
			return HttpResponseBadRequest("Error : code status not 200")
		else:
			return get42UserData(request ,response)
	else :
		return HttpResponseBadRequest("Bad request : not GET")

def	logoutUser(request):
	if request.user.is_authenticated:
		logout(request)
		return JsonResponse({"message": "Response : logout"}, status=200)
	else:
		return JsonResponse({"message": "Response : no_auth"}, status=401)

def	is_auth(request):
	if request.user.is_authenticated:
		return JsonResponse({"message": "Response : auth"}, status=200)
	else:
		return JsonResponse({"message": "Response : no_auth"}, status=401)