FROM python:3.9

WORKDIR /app

COPY export-platform-info.py /app/export-platform-info.py

RUN pip3 install psutil
RUN apt-get -y update; apt-get -y install curl

CMD ["python", "export-platform-info.py"]
