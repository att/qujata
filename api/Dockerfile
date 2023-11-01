FROM python:3.9

# --- NETFREE CERT INTSALL ---
ADD https://netfree.link/dl/unix-ca.sh /home/netfree-unix-ca.sh
RUN cat  /home/netfree-unix-ca.sh | sh
ENV NODE_EXTRA_CA_CERTS=/etc/ca-bundle.crt
ENV REQUESTS_CA_BUNDLE=/etc/ca-bundle.crt
ENV SSL_CERT_FILE=/etc/ca-bundle.crt
# --- END NETFREE CERT INTSALL ---

WORKDIR /api

RUN pip3 install flask
RUN pip3 install flask-cors
RUN pip3 install datetime
RUN pip3 install requests

# RUN apt-get -y update; apt-get -y install curl

COPY app.py .

CMD ["python3", "app.py"]

EXPOSE 3020