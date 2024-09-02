FROM    debian:bullseye

RUN apt update
RUN apt upgrade
RUN	apt install -y sudo apt install libpq-dev

WORKDIR /app

COPY config/ .
RUN pip install -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]