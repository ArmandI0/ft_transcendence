from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongGameResult ,Tournament ,CardGameResult
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
from .serializers import PongChartResultSerializer , CardChartResultSerializer , PongGameResultSerializer , CardGameResultSerializer , GameHistorySerializer
from itertools import chain
from operator import attrgetter

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
        result = PongGameResult()
        player1 = request.user

        result.player1 = player1
        result.guest1 = request.data.get('player1')
        result.guest2 = request.data.get('player2')
        result.score_player1 = request.data.get('score_player1')
        result.score_player2 = request.data.get('score_player2')
        result.game = request.data.get('game')
        result.mode = request.data.get('mode')
        result.game_duration = request.data.get('game_duration')
        result.date = request.data.get('date')
        tournament_id = request.data.get('tournament_id')
        if (tournament_id != None and result.mode == 'TOURNAMENT'):
            try:
                result.tournament_id = Tournament.objects.get(tournament_id=tournament_id)
            except:
                return JsonResponse({'error': 'Tournament not found'}, status=200)
        else:
            result.tournament_id
        result.full_clean()
        result.save()
        return JsonResponse({'id': result.game_id}, status=200)
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
        result = CardGameResult()  
        player = request.user

        result.player = player
        result.score_player = request.data.get('score_player')  
        result.game_duration = request.data.get('game_duration')  
        result.date = request.data.get('date')
        result.mode = request.data.get('mode')
        tournament_id = request.data.get('tournament_id') 
        if tournament_id != None and result.mode == 'TOURNAMENT':
            try:
                result.tournament_id = Tournament.objects.get(tournament_id=tournament_id)
            except Tournament.DoesNotExist:
                return JsonResponse({'error': 'Tournament not found'}, status=200)
        else:
            result.tournament_id = None
        result.full_clean()
        result.save()

        return JsonResponse({'id': result.game_id}, status=200)

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
        result = Tournament()
        result.game_type = request.data.get('game_type')
        result.date = request.data.get('date')  
        result.full_clean()
        result.save()
        return JsonResponse({'id': result.tournament_id}, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# https://localhost/api/get_result/

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getResult(request):
    try:
        user = request.user
        gameType = request.data.get('gameType') 
        # gameType = data.get('gameType')

        if gameType == 'RollandGapong':
            results = PongGameResult.objects.filter(player1=user, game=gameType).order_by('-date').all()
            serializer = PongChartResultSerializer(results, many=True)
            return Response(serializer.data)
        elif gameType == 'Cyberpong':
            results = PongGameResult.objects.filter(player1=user, game=gameType).order_by('-date').all()
            serializer = PongChartResultSerializer(results, many=True)
            return Response(serializer.data)
        elif gameType == 'Cards':
            results = CardGameResult.objects.filter(player=user).order_by('-date').all()
            serializer = CardChartResultSerializer(results, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'game type not recognized'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getGameHistory(request):
    try:
        user = request.user
        pong_results = PongGameResult.objects.filter(player1=user).all()
        card_results = CardGameResult.objects.filter(player=user).all()
        combined_list = sorted(
            chain(pong_results, card_results), 
            key=attrgetter('date'),
            reverse=True
        )
        latest_25_results = GameHistorySerializer(combined_list[:25],many= True)
        return Response(latest_25_results.data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
