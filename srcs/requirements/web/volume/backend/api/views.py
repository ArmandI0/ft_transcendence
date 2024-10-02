from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongResult
from django.views.decorators.csrf import csrf_exempt
from backend.utils import get_postgres_cred_dbuser_wo , configure_database
import json

@csrf_exempt
def setPongResult(request):
    crd,status = get_postgres_cred_dbuser_wo()
    if crd:
        dbuser = crd['data']['username']
        passwd = crd['data']['password']
        # configure_database(dbuser, passwd)
        print("**************************")
        print(dbuser)
        print(passwd)
        print("**************************")
    else:
        print(status)    
    try:
        if request.method == 'POST':
            # Assurez-vous que `PongResult` est un modèle Django
            # et que vous extrayez correctement les données de la requête
            data = json.loads(request.body)  # Désérialisation du JSON

            # Supposons que ton modèle PongResult a des champs 'field1' et 'field2'
            result = PongResult(**data) # Utilisez `request.POST` pour obtenir les données du POST
            result.full_clean()
            result.save()
            return JsonResponse({'error': 'ok'}, status=200)  # Indiquez un statut 200 pour un succès
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)  # Gérer les autres méthodes
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)  # Utilisez le statut 500 pour une erreur interne
    # crd,status = get_postgres_cred_dbuser_wo()
    # if crd:
    #     dbuser = crd['data']['username']
    #     passwd = crd['data']['password']
    #     configure_database(dbuser, passwd)
    #     print("**************************")
    #     print(dbuser)
    #     print(passwd)
    #     print("**************************")
    # else:
    #     print(status)
    