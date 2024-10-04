from django.db import models

class PongResult(models.Model):
    player1 = models.CharField(max_length=200)
    player2 = models.CharField(max_length=200)
    score_player1 = models.CharField(max_length=10)
    score_player2 = models.CharField(max_length=10)
    gameType = models.CharField()
    date = models.DateTimeField()
    class Meta:
        db_table = 'pong_result'
        ordering = ['-date']