from django.urls import path
from .views import setPongResult, setCardResult, getPongResult, getCardResult, setTournament

urlpatterns = [
    path('set_pong_result/', setPongResult, name='set_pong_result'),
    path('set_card_result/', setCardResult, name='set_card_result'),
    path('get_pong_result/', getPongResult, name='get_pong_result'),
    path('get_card_result/', getCardResult, name='get_card_result'),
    path('set_tournament/', setTournament, name='set_tournament')
]