from django.shortcuts import render , redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate , login as auth_login
from django.contrib.auth.forms import AuthenticationForm , UserCreationForm
from django.http import JsonResponse, HttpResponseBadRequest
import logging
import json
import requests
from .utils import get_api42_cred_vault
from .utils import get_postgres_cred_dbuser_wo
from django.contrib import messages
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def get42UserData(response):
	try:
		json_data = response.json()
		access_token = json_data.get('access_token')
		url = 'https://api.intra.42.fr/v2/me'
		headers = {
			'Authorization': f'Bearer {access_token}'
		}
		response = requests.get(url, headers=headers)
		user_data = response.json()
		return JsonResponse(user_data)
	except ValueError:
		return JsonResponse({'error': 'Failed to retrieve token', 'details': response.json()}, status=response.status_code)
	
def api42_request(request) :
	if request.method == 'GET':
		code = request.GET.get('code')
		url = 'https://api.intra.42.fr/oauth/token'

		secret_data, status = get_api42_cred_vault()
		uid = secret_data['data']['client_id']
		passwd = secret_data['data']['client_secret']

		data = {
			"grant_type": "authorization_code",
			'client_id': uid,
			'client_secret': passwd,
			'code': code,
			'redirect_uri': 'http://localhost:8070'
		}
		headers = {"Content-Type": "application/json; charset=utf-8"}
		response = requests.post(url, headers=headers, json=data)
		if response.status_code != 200:
			return HttpResponseBadRequest("Error : code status not 200")
		else:
			return get42UserData(response)
	else :
		return HttpResponseBadRequest("Bad request : not GET") 

def put_data_db(request) :
	if request.method == 'POST':
		secret_data, status = get_postgres_cred_dbuser_wo()
		if (status == 200) :
			dbuser = secret_data['data']['client_id']
			passwd = secret_data['data']['client_secret']
			print(dbuser)
			print(passwd)
			return JsonResponse(secret_data.json())

		else:
			print("err req vault, status: ")
			print(status)

		# data = {
		# 	"grant_type": "authorization_code",
		# 	'client_id': uid,
		# 	'client_secret': passwd,
		# 	'code': code,
		# 	'redirect_uri': 'http://localhost:8070'
		# }
		# headers = {"Content-Type": "application/json; charset=utf-8"}
		# response = requests.post(url, headers=headers, json=data)
		# if response.status_code != 200:
		# 	return HttpResponseBadRequest("Error : code status not 200")
		# else:
		# 	return JsonResponse(response.json())
			return HttpResponseBadRequest("ERR VAULT") 
	else :
		return HttpResponseBadRequest("Bad request : not POST") 
