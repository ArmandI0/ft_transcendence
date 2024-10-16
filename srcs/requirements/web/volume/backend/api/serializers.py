from rest_framework import serializers
from .models import PongGameResult

class PongChartResultSerializer(serializers.ModelSerializer):
    won = serializers.SerializerMethodField()
    time = serializers.SerializerMethodField()
    class Meta:
        model = PongGameResult
        fields = ['game_id' , 'won' , 'time']
    def get_won(self, obj):
        try:
            return int(obj.score_player1) > int(obj.score_player2)
        except ValueError:
            return False
    def get_time(self, obj):
        return obj.game_duration

class CardChartResultSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()
    class Meta:
        model = PongGameResult
        fields = ['game_id' , 'time']
    def get_time(self, obj):
        total_seconds = obj.game_duration.hour * 3600 + obj.game_duration.minute * 60 + obj.game_duration.second
        return total_seconds