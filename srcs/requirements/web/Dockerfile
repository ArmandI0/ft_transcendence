FROM    python:3.11-slim-bullseye

COPY    conf/requirements.txt .
RUN     apt-get update && apt-get install -y build-essential libpq-dev
RUN     pip install --upgrade pip && pip install -r requirements.txt
RUN     chmod +x entrypoint.sh
RUN     apt-get install -y curl
COPY    conf/entrypoint.sh .
ENTRYPOINT [ "bash" ]
CMD     ["./entrypoint.sh"]