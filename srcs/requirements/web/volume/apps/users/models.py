from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager ,AbstractUser
# Create your models here.

class User(AbstractUser):
    name = models.CharField(max_length=40)
    firstname = models.EmailField(max_length=40)
    mail = models.CharField(max_length=200)