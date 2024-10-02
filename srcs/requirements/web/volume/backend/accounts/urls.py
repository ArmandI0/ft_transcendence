from django.urls import path
from .views import api42_request

urlpatterns = [
    path('api42/', api42_request, name='api42'),
]