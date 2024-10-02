from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongResult
from django.views.decorators.csrf import csrf_exempt
from backend.utils import get_postgres_cred_dbuser_wo

@csrf_exempt
def setPongResult(request):
    crd,status = get_postgres_cred_dbuser_wo()
    if crd:
        dbuser = crd['data']['username']
        passwd = crd['data']['password']
        print(dbuser)
        print(passwd)
    else:
        print(status)

    try:
        if (request):
            result = PongResult(**request)
            result.full_clean()
            result.save()
    except:
        return JsonResponse({'error': 'jkfgjgrejkgrehjkln;fgdahnb;fkldbn'}, status=404)
    