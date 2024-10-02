from django.urls import path
from .views import setPongResult

urlpatterns = [
    path('set_pong_result/', setPongResult, name='set_pong_result'),
]