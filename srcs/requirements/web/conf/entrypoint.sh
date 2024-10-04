#!/bin/bash

while [ "$(curl -s -o /dev/null -w "%{http_code}" http://vault:8200/v1/sys/health?standbyok=true)" -ne 200 ]; 
do sleep 1; 
done

sleep 5
echo "Applying database migrations..."
python website/backend/manage.py makemigrations
sleep 5
python website/backend/manage.py migrate
sleep 5
echo "Starting Django server..."
python website/backend/manage.py runserver 0.0.0.0:8000