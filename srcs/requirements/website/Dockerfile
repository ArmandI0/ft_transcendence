FROM debian:bullseye

# Repertoir de travail
WORKDIR /usr/share/static-site/

RUN apt update && apt upgrade -y && apt install -y nodejs npm && apt clean
RUN npm install -g http-server

# Copier les fichiers du site statique dans un répertoire
COPY static-site/ /usr/share/static-site/

COPY /static-site/img.jpg .

# Démarrer http-server
CMD ["http-server", "-p", "9000", "-d", "/usr/share/static-site"]