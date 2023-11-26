FROM python:3.9

WORKDIR /api

COPY src src
COPY config config
COPY requirements.txt .
COPY .env .

RUN pip3 install -r requirements.txt

CMD ["python3", "-m", "src.main"]

EXPOSE 3020