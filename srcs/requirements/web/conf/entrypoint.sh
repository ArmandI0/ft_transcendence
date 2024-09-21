#!/bin/bash

sleep 5
echo "Applying database migrations..."
python website/backend/manage.py makemigrations
sleep 5
python website/backend/manage.py migrate
sleep 5
#run website
echo "Starting Django server..."
python website/backend/manage.py runserver 0.0.0.0:8000