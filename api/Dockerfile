FROM python:3.9

WORKDIR /api

COPY src src
COPY config config
COPY main.py main.py
COPY requirements.txt .
COPY .env .

RUN pip3 install -r requirements.txt

CMD ["python3", "-m", "main"]

EXPOSE 3020