from django.db import models
from accounts.models import Api42User

class Tournament(models.Model):
    tournament_id = models.AutoField(primary_key=True)
    GAME_TYPE_CHOICES = [
        ('RollandGapong', 'RollandGapong'),
        ('Cyberpong', 'Cyberpong'),
        ('Card', 'Card'),
    ]
    game_type = models.CharField(max_length=255, choices= GAME_TYPE_CHOICES)
    date = models.DateTimeField()
    class Meta:
        db_table = 'tournament'
        ordering = ['-date']

class PongGameResult(models.Model):
    game_id = models.AutoField(primary_key=True)
    player1 = models.ForeignKey(Api42User, on_delete=models.CASCADE)
    guest1 = models.CharField(max_length=255, blank=True, null=True)
    guest2 = models.CharField(max_length=255, blank=True, null=True)
    score_player1 = models.CharField(max_length=255)
    score_player2 = models.CharField(max_length=255)
    GAME_CHOICES = [
        ('RollandGapong', 'RollandGapong'),
        ('Cyberpong', 'Cyberpong'),
    ]
    game = models.CharField(max_length=255, choices=GAME_CHOICES, default='RollandGapong')
    MODE_CHOICES = [
        ('IA', 'IA'),
        ('COOP', 'COOP'),
        ('TOURNAMENT', 'TOURNAMENT'),
        ('LOCAL1V1', 'LOCAL1V1')
    ]
    mode = models.CharField(max_length=255, choices=MODE_CHOICES, default='LOCAL1v1')
    game_duration = models.TimeField()
    date = models.DateTimeField()
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True)
    tournament_phase = models.CharField(max_length=255, null=True, blank=True)
    class Meta:
        db_table = 'pong_result'
        ordering = ['-date']
    def save(self, *args, **kwargs):
        if self.guest1:
            self.player1 = None
        super().save(*args, **kwargs)

class CardGameResult(models.Model):
    game_id = models.AutoField(primary_key=True)
    player = models.ForeignKey(Api42User, on_delete=models.CASCADE)
    date = models.DateTimeField()
    game = models.CharField(max_length=255, default="CardGame")
    MODE_CHOICES = [
        ('SOLO', 'SOLO'),
        ('TOURNAMENT', 'TOURNAMENT')
    ]
    mode = models.CharField(max_length=255, choices=MODE_CHOICES, default='SOLO')
    game_duration = models.TimeField()
    tournament_id = models.ForeignKey(Tournament, on_delete=models.CASCADE, null=True, blank=True)
    class Meta:
        db_table = 'card_result'
        ordering = ['-date']