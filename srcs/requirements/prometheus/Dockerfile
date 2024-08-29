FROM debian:bullseye

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install -y wget tar

# Crée un utilisateur non-root pour exécuter Prometheus
RUN useradd -ms /bin/bash prometheus

# Téléchargement et installation de Prometheus
RUN mkdir /prometheus
WORKDIR /prometheus
RUN wget https://github.com/prometheus/prometheus/releases/download/v2.45.0/prometheus-2.45.0.linux-amd64.tar.gz
RUN tar -xvf prometheus-2.45.0.linux-amd64.tar.gz
RUN mv prometheus-2.45.0.linux-amd64/* /prometheus/
RUN chown -R prometheus:prometheus /prometheus

COPY prometheus.yml /prometheus/prometheus.yml
EXPOSE 9090
USER prometheus

CMD ["./prometheus", "--config.file=/prometheus/prometheus.yml"]
