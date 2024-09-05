FROM    python:3-slim-bullseye

COPY    conf/entrypoint.sh .
COPY    conf/requirements.txt .

RUN     pip install -r requirements.txt
RUN     chmod +x entrypoint.sh

ENTRYPOINT [ "bash" ]
CMD ["entrypoint.sh"]


