FROM python:3.9

WORKDIR /api

COPY requirements.txt .
COPY app.py .
COPY algorithms.py .
COPY .env .

RUN pip3 install -r requirements.txt

CMD ["python3", "app.py"]

EXPOSE 3020