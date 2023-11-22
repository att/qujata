FROM python:3.9

WORKDIR /api

COPY src src
COPY requirements.txt .
COPY .env .

RUN pip3 install -r requirements.txt

CMD ["python3", "src/main.py"]

EXPOSE 3020