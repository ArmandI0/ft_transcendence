from rest_framework import serializers
from .models import PongGameResult , CardGameResult
from datetime import timedelta

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
    won = serializers.SerializerMethodField()
    class Meta:
        model = PongGameResult
        fields = ['game_id', 'won' , 'time']
    def get_won(self, obj):
        if obj.game_duration <= timedelta(minutes=1):
            return True
        else:
            return False
    def get_time(self, obj):
        return obj.game_duration

class PongGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PongGameResult
        fields = '__all__'

class CardGameResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardGameResult
        fields = '__all__'

class GameHistorySerializer(serializers.Serializer):
    game_type = serializers.CharField()
    data = serializers.JSONField()
    def to_representation(self, instance):
        if isinstance(instance, PongGameResult):
            return {
                'game_type': instance.game,
                'data': PongGameResultSerializer(instance).data
            }
        elif isinstance(instance, CardGameResult):
            return {
                'game_type': 'Card',
                'data': CardGameResultSerializer(instance).data
            }
        return super().to_representation(instance)