from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongGameResult ,Tournament ,CardGameResult
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
from .serializers import PongChartResultSerializer , CardChartResultSerializer


# JSON RESULT PONG => https://localhost/api/set_pong_result/
# {
#   "player2": "player_two",
#   "score_player1": "7",
#   "score_player2": "5",
#   "game": "pong",
#   "game_duration": "00:15:00",
#   "date": "2024-10-08T18:00:00Z",
#
#   "tournament_id": {id tournament} => Ne pas renseigner si la partie ne fait pas partie d'un tournoi
#   }
# }


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setPongResult(request):
    try:
        data = json.loads(request.body)
        result = PongGameResult()
        player1 = request.user

        result.player1 = player1
        result.player2 = data.get('player2')
        result.score_player1 = data.get('score_player1')
        result.score_player2 = data.get('score_player2')
        result.game = data.get('game')
        result.game_duration = data.get('game_duration')
        result.date = data.get('date')
        tournament_id = data.get('tournament_id')
        if (tournament_id != None):
            try:
                result.tournament_id = Tournament.objects.get(id=tournament_id)
            except:
                return JsonResponse({'error': 'Tournament not found'}, status=404)
        else:
            result.tournament_id
        result.full_clean()
        result.save()
        return JsonResponse({'success': result.game_id}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400) 


# SET CARD RESULT => https://localhost/api/set_card_result/
# {
#   "score_player": "1500",
#   "date": "2024-10-08T20:00:00Z",
#   "game_duration": "00:25:00",
#   "tournament_id": {id tournament} => Ne pas renseigner si la partie ne fait pas partie d'un tournoi
#   }
# }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setCardResult(request):
    try:
        data = json.loads(request.body)
        result = CardGameResult()  
        player = request.user

        result.player = player
        result.score_player = data.get('score_player')  
        result.game_duration = data.get('game_duration')  
        result.date = data.get('date') 
        tournament_id = data.get('tournament_id') 
        if tournament_id is not None:
            try:
                result.tournament_id = Tournament.objects.get(id=tournament_id)
            except Tournament.DoesNotExist:
                return JsonResponse({'error': 'Tournament not found'}, status=404)
        else:
            result.tournament_id = None

        result.full_clean()
        result.save()

        return JsonResponse({'success': result.game_id}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# SET TOURNAMENT => => https://localhost/api/set_tournament/
# {
#   "game_type": "pong",
#   "game_duration": "00:30:00",
#   "date": "2024-10-01T15:00:00Z",
#   "tournament_winner": {
#     "id": 123,
#     "username": "winner_user",
#     "email": "winner@example.com"
#   }
# }

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def setTournament(request):
    try:
        data = json.loads(request.body)
        result = Tournament()

        result.game_type = data.get('game_type')
        result.date = data.get('date')  
        result.full_clean()
        result.save()
        return JsonResponse({'success': result.tournament_id}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


# https://localhost/api/get_pong_result/

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getPongResult(request):
    user = request.user
    results = PongGameResult.objects.filter(player1=user).order_by('-date').all()
    serializer = PongChartResultSerializer(results, many=True)
    return Response(serializer.data)

# https://localhost/api/get_card_result/

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCardResult(request):
    user = request.user
    results = CardGameResult.objects.filter(player=user).order_by('-date').all()
    serializer = CardChartResultSerializer(results, many=True)
    return Response(serializer.data)
