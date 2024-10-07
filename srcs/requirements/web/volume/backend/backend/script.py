import requests
import random

# Remplacez par l'URL de votre API
API_URL = 'https://localhost/api/pongresults/'  # Ajustez selon votre configuration

# Remplacez par le token d'authentification de l'utilisateur
AUTH_TOKEN = 'your_auth_token_here'  # Remplacez par le token réel de l'utilisateur

# En-têtes de la requête, incluant l'authentification
headers = {
    'Authorization': f'Token {AUTH_TOKEN}',  # Utilisez le type d'authentification approprié
    'Content-Type': 'application/json'
}

# Boucle pour créer 25 parties
for i in range(25):
    # Données à envoyer
    data = {
        'player2': f'Player {i + 2}',  # Nom du joueur 2
        'score_player1': str(random.randint(0, 15)),  # Score aléatoire pour Player 1
        'score_player2': str(random.randint(0, 15)),  # Score aléatoire pour Player 2
        'game': 'pong',  # Type de jeu
        'game_duration': '00:05:30',  # Durée du jeu au format HH:MM:SS
        'date': f'2024-10-07T15:0{i}:00Z',  # Date du jeu (modifiez si nécessaire)
        'tournament_id': random.choice([1, 2, 3])  # ID du tournoi (ajustez selon vos tournois disponibles)
    }

    try:
        # Envoi de la requête POST
        response = requests.post(API_URL, json=data, headers=headers)

        # Vérification de la réponse
        if response.status_code == 200:
            print(f'Partie {i + 1} créée avec succès:', response.json())
        else:
            print(f'Erreur lors de la création de la partie {i + 1}:', response.json())
    except Exception as e:
        print(f'Une erreur est survenue lors de la création de la partie {i + 1}:', str(e))