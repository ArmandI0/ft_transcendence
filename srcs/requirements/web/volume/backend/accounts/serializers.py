from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    # On ajoute un champ supplémentaire pour la confirmation du mot de passe
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']

    def validate(self, data):
        # On vérifie que le mot de passe et sa confirmation correspondent
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        return data

    def create(self, validated_data):
        # On retire la confirmation avant de créer l'utilisateur
        validated_data.pop('password_confirm')
        # On utilise la méthode `create_user` pour que le mot de passe soit hashé
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']  # Le mot de passe sera automatiquement hashé
        )
        return user
