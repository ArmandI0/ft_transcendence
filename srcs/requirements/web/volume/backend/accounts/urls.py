from django.urls import path
from .views import api42_request , is_auth, logoutUser

urlpatterns = [
    path('api42/', api42_request, name='api42'),
    path('is_auth/', is_auth, name='is_auth'),
    path('logout/', logoutUser, name='logout')
]