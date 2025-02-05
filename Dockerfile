# first stage
FROM node:18-alpine AS build

ENV PATH /app/node_modules/.bin:$PATH
WORKDIR /app
COPY . /app
COPY ./.env /app/.env
RUN npm install
RUN npm run build
RUN ls

# second stage
FROM alpine:3.19.1

RUN apk update
RUN apk add --no-cache nginx supervisor bash

COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/http.d

RUN mkdir -p /var/log/supervisor
COPY ./docker/supervisord/supervisord.conf /etc/supervisord.conf
COPY ./docker/supervisord/conf.d /etc/supervisor/conf.d

EXPOSE 80
ENTRYPOINT ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]