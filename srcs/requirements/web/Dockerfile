FROM    python:3-slim-bullseye

COPY    conf/entrypoint.sh .
COPY    conf/requirements.txt .
RUN     apt-get update && apt-get install -y build-essential libpq-dev
RUN     pip install -r requirements.txt
RUN     chmod +x entrypoint.sh

ENTRYPOINT [ "bash" ]
CMD ["entrypoint.sh"]


