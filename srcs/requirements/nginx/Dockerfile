FROM		debian:bullseye

RUN apt update
RUN apt upgrade
RUN	apt install nginx -y
RUN apt install iputils-ping -y
RUN mkdir -p /etc/nginx/ssl

RUN mkdir -p /var/run/nginx
COPY conf/nginx.conf /etc/nginx/nginx.conf

RUN chmod 755 /var/www/html
RUN chown -R www-data:www-data /var/www/html

CMD ["nginx", "-g", "daemon off;"]