#!/bin/sh
node app.js &
nginx -c /opt/nginx/nginx-conf/nginx.conf -g 'daemon off;'
