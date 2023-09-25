FROM node:18-alpine

LABEL org.opencontainers.image.authors="ianlcz"

WORKDIR /home/gestidogs-api-server

COPY . .

RUN npm ci

EXPOSE 8080

CMD [ "npm", "run", "start:dev" ]