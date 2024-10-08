import requests
import random

API_URL = 'http://localhost:8000/api/set_pong_result/'

SESSION_ID = 'n31p4a512fq3k0zeywebeu0yw9hdcsw8'


headers = {
    'Cookie': f'sessionid={SESSION_ID}',    # Utilisation de l'ID de session dans les cookies
    'Content-Type': 'application/json'
}

for i in range(25):
    data = {
        'player2': f'Player {i + 2}',
        'score_player1': str(random.randint(0, 15)),
        'score_player2': str(random.randint(0, 15)),
        'game': 'pong',
        'game_duration': '00:05:30',
        'date': f'2024-10-07T15:0{i}:00Z', 
        'tournament_id': random.choice([1, 2, 3])
    }

    try:
        response = requests.post(API_URL, json=data, headers=headers)
        if response.status_code == 200:
            print(f'Partie {i + 1} créée avec succès:', response.json())
        else:
            print(f'Erreur lors de la création de la partie {i + 1}:', response.json())
    except Exception as e:
        print(f'Une erreur est survenue lors de la création de la partie {i + 1}:', str(e))