FROM node:latest AS build

RUN echo $IMAGE_TAG

RUN npm install -g @angular/cli

WORKDIR /app

COPY . /app

RUN npm i

RUN ng build --configuration $IMAGE_TAG

FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile

COPY --from=build /app/dist/tasknet/browser /usr/share/caddy/
