FROM nginx:1.25-alpine3.18

RUN apk add --update nodejs npm

## Replace the default nginx index page with our portal
RUN rm -rf /usr/share/nginx/html/*
# RUN npm install -g yarn 
COPY . .
RUN npm install -g yarn
RUN yarn install
RUN yarn build && cp -r  build/* /usr/share/nginx/html && cp build/index.html /usr/share/nginx/html/index.html.tpl && chmod 755 -R /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

COPY docker-entrypoint.sh docker-entrypoint.sh
RUN ["chmod", "+x", "docker-entrypoint.sh"]
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["app:start"]
