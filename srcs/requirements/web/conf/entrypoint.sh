#!/bin/bash

sleep 5

echo "Applying database migrations..."
python3 website/manage.py makemigrations
python3 website/manage.py migrate

#run website
echo "Starting Django server..."
python3 website/manage.py runserver 0.0.0.0:8000