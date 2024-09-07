from django.shortcuts import render , redirect
from django.forms import ModelForm
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate , login as auth_login
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
        if user_form.is_valid():
            user = user_form.save()
            user = authenticate(username=user_form.cleaned_data['username'], password=user_form.cleaned_data['password1'])
            if user is not None:
                # Connecte l'utilisateur
                auth_login(request, user)
                return redirect('') 
            # Si l'authentification échoue
                logger.debug("Authentication failed")
        
        logger.debug(user_form.is_valid())

        logger.debug(user_form.errors)

    logger.debug("views login")  # Utilise le logger pour les messages de débogage
    return render(request, 'login.html' , {'user_form' : UserForm})
