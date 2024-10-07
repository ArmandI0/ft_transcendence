from rest_framework import serializers
from .models import PongGameResult

class PongChartResultSerializer(serializers.ModelSerializer):
    player1_won = serializers.SerializerMethodField()
    class Meta:
        model = PongGameResult
        fields = ['game_id' , 'player1_won' , 'time']
    def get_player1_won(self, obj):
        try:
            return int(obj.score_player1) > int(obj.score_player2)
        except ValueError:
            return False