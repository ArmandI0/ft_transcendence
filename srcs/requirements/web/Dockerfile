FROM    python:3.11-slim-bullseye

COPY    conf/requirements.txt .
RUN     apt-get update && apt-get install -y build-essential libpq-dev
RUN     pip install --upgrade pip && pip install -r requirements.txt
RUN     apt-get install -y curl && apt-get install jq -y
COPY    conf/entrypoint.sh .
RUN     chmod +x entrypoint.sh
ENTRYPOINT [ "bash" ]
CMD     ["./entrypoint.sh"]