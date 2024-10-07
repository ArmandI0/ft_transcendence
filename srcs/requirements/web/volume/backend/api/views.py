from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongGameResult
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def setPongResult(request):
    try:
        if request.method == 'POST':
            data = json.loads(request.body)
            result = PongGameResult(**data)
            result.full_clean()
            result.save()
            return JsonResponse({'error': 'ok'}, status=200)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400) 

def getPongResult(request):
    if request.method == 'POST':
        data = json.loads(request.body)
