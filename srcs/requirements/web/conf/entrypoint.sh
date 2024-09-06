#!/bin/bash

sleep 5
echo "Applying database migrations..."
python website/manage.py makemigrations
sleep 5
python website/manage.py migrate
sleep 5
#run website
echo "Starting Django server..."
python website/manage.py runserver 0.0.0.0:8000