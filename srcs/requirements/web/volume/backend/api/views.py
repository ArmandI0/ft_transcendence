from django.shortcuts import render
from django.http import JsonResponse, HttpResponseBadRequest
from .models import PongGameResult ,Tournament ,CardGameResult
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json
from django.views.decorators.csrf import csrf_exempt
from .serializers import PongChartResultSerializer

@api_view(['POST'])  # Déclare que cette vue ne peut recevoir que des requêtes POST
@permission_classes([IsAuthenticated])  # Assure que seuls les utilisateurs authentifiés peuvent accéder à cette vue
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
# {
#     "player1_id": 1,  // L'ID de player1 dans la table Api42User
#     "player2": "Joueur 2",
#     "score_player1": "10",
#     "score_player2": "8",
#     "game": "pong",  // ou "pong3D"
#     "game_duration": "00:15:30",  // Durée du jeu
#     "date": "2023-10-07T14:48:00",  // Date et heure du jeu
#     "tournament_id": 1  // L'ID du tournoi dans la table Tournament
# }

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPongResult25(request):
    user = request.user
    results = PongGameResult.objects.filter(player_1=user).order_by('-date')[:25]
    serializer = PongChartResultSerializer(results, many=True)
    return Response(serializer.data)


# reqPong et Pong3D
# {
#     "total_game_played" : x,
#     "total_game_won" : x,
#     "game_played_by_week" :[week1:x,week2:x,...],
# }

# reqCard
# {
#     "total_game_played": x,
#     "total_game_won" : x, 
#     "game_played_by_week" : [week1:x,week2:x,...],
#     "time_to_win_by_game_won_in_secs" : [t1,t2,t3,...],
# } (modifié)
