from django.db import models
from accounts.models import Api42User

class Tournament(models.Model):
    tournament_id = models.AutoField(primary_key=True)
    GAME_TYPE_CHOICES = [
        ('pong', 'Pong'),
        ('card', 'Card'),
    ]
    game_type = models.CharField(max_length=10, choices= GAME_TYPE_CHOICES)
    date = models.DateTimeField()
    class Meta:
        db_table = 'tournament'
        ordering = ['-date']

class PongGameResult(models.Model):
    game_id = models.AutoField(primary_key=True)
    player1 = models.ForeignKey(Api42User, on_delete=models.CASCADE)
    player2 = models.CharField(max_length=200)
    score_player1 = models.CharField(max_length=10)
    score_player2 = models.CharField(max_length=10)
    GAME_CHOICES = [
        ('pong', 'Pong'),
        ('pong3D', 'Pong3D'),
    ]
    game = models.CharField(max_length=10, choices=GAME_CHOICES, default='pong')
    game_duration = models.TimeField()
    date = models.DateTimeField()
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True)
    tournament_phase = models.CharField(max_length=10, null=True, blank=True)
    class Meta:
        db_table = 'pong_result'
        ordering = ['-date']

class CardGameResult(models.Model):
    game_id = models.AutoField(primary_key=True)
    player = models.ForeignKey(Api42User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    game_duration = models.TimeField()
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True)
    class Meta:
        db_table = 'card_result'
        ordering = ['-date']

