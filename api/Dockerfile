FROM python:3.9

WORKDIR /api

RUN pip3 install flask
RUN pip3 install flask-cors
RUN pip3 install datetime
RUN pip3 install requests

COPY app.py .

CMD ["python3", "app.py"]

EXPOSE 3020