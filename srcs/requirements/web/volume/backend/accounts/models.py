from django.db import models
from django.contrib.auth.models import AbstractUser

class Api42User(AbstractUser):
    login42 = models.CharField()
    password = models.CharField(max_length=128, null=True, blank=True)
    def __str__(self):
        return self.username
