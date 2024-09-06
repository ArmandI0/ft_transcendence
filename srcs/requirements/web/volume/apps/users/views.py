from django.shortcuts import render , redirect
from django.forms import ModelForm
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.forms import UserCreationForm
from .models import User

import logging
logger = logging.getLogger(__name__)

class UserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('name' , 'firstname' , 'mail')

def login(request) :
    if request.method == 'POST':
        user_form = UserForm(request.POST)
        user_form.is_valid()
        user_form.save()
        logger.debug(user_form.is_valid())
        logger.debug(user_form.errors)

    logger.debug("views login")  # Utilise le logger pour les messages de débogage
    return render(request, 'login.html' , {'user_form' : UserForm})
