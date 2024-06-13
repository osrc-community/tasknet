FROM python:3.12.4

WORKDIR /app

COPY ./ /app

RUN rm /app/.env

RUN pip install -r /app/requirements.txt

CMD [ "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000" ]
