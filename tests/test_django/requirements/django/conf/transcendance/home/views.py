from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def home(request):
    return render(request, 'index.html')

def game_2d(request):
    return render(request, 'game_container_2d.html')

def game_3d(request):
    return render(request, 'game_container_3d.html')