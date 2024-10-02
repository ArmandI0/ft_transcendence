from django.urls import path
from .views import setPongResult

urlpatterns = [
    path('setPongResult/', setPongResult, name='setPongResult'),
]