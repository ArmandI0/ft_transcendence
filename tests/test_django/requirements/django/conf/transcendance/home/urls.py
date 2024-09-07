from django.urls import path
from . import views
from .views import game_2d
from .views import game_3d

urlpatterns = [
    path('', views.home, name='home'),
	path('api/game_2d/', game_2d, name='game_2d'),
	path('api/game_3d/', game_3d, name='game_3d'),
]
