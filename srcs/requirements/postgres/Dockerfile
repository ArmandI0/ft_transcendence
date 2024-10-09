FROM postgres:13

RUN apt-get update -y && apt-get upgrade -y
RUN apt-get install curl -y
RUN apt-get install jq -y
COPY ./conf/conf_postgres.sh /conf_postgres.sh
ENTRYPOINT [ "bash", "/conf_postgres.sh" ]