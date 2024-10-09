FROM		debian:bullseye

RUN apt update -y && apt upgrade -y
RUN apt install apache2 libapache2-mod-security2 -y
RUN a2enmod security2
RUN a2enmod proxy
RUN a2enmod proxy_http
RUN a2enmod ssl
RUN a2enmod rewrite

COPY ./conf/modsecurity.conf /etc/modsecurity/.
COPY ./conf/conf_apache.sh /conf.sh
COPY ./conf/transc_vhost.conf /etc/apache2/sites-available/transc_vhost.conf
RUN a2ensite transc_vhost.conf
RUN apt-get install curl -y
RUN mkdir app
RUN mkdir cert
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /cert/localhost.key -out /cert/localhost.crt -subj "/CN=localhost"

ENTRYPOINT [ "bash", "/conf.sh" ]
#ENTRYPOINT [ "apachectl", "-D", "FOREGROUND" ]