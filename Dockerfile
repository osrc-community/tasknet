FROM node:latest AS build

ARG IMAGE_TAG

RUN npm install -g @angular/cli

WORKDIR /app

COPY ./frontend /app

RUN npm i

RUN ng build --configuration ${IMAGE_TAG}

FROM registry.osrc.community/docker-images/s6-ms:1.0

WORKDIR /app

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=build /app/dist/tasknet/browser /usr/share/caddy/

COPY backend/ /app

RUN chmod -R 777 /app/*

RUN python3 -m venv .venv && . .venv/bin/activate && pip3 install -r requirements.txt
