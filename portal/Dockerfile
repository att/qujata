FROM nginx:1.25-alpine3.18

RUN apk --no-cache add --update nodejs npm

## Replace the default nginx index page with our portal
RUN rm -rf /usr/share/nginx/html/*
RUN mkdir /usr/share/nginx/html/qujata
# RUN npm install -g yarn 
COPY . .
RUN npm install -g yarn
RUN yarn install
RUN yarn build && cp -r  build/* /usr/share/nginx/html/qujata && cp build/index.html /usr/share/nginx/html/qujata/index.html.tpl && chmod 755 -R /usr/share/nginx/html/qujata

COPY nginx.conf /etc/nginx/nginx.conf

COPY docker-entrypoint.sh docker-entrypoint.sh
RUN ["chmod", "+x", "docker-entrypoint.sh"]
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["app:start"]
