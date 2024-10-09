from django.urls import path
from .views import setPongResult, setCardResult, getResult, setTournament

urlpatterns = [
    path('set_pong_result/', setPongResult, name='set_pong_result'),
    path('set_card_result/', setCardResult, name='set_card_result'),
    path('get_result/', getResult, name='get_result'),
    path('set_tournament/', setTournament, name='set_tournament')
]