from django.urls import path
from .views import register, api42_request

urlpatterns = [
    path('register/', register, name='register'),
    path('api42/', api42_request, name='api42'),
]