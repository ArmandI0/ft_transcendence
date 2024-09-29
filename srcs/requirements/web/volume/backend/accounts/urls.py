from django.urls import path
from .views import register, api42_request, put_data_db

urlpatterns = [
    path('register/', register, name='register'),
    path('api42/', api42_request, name='api42'),
	path('sendscore/', put_data_db, name='putdatadb'),
]