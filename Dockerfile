FROM node:21-alpine

ARG WORKDIR=web-client

WORKDIR $WORKDIR

COPY package.json .
COPY package-lock.json .

RUN npm install -g serve

RUN npm install

COPY . .

RUN npm run build

CMD serve -s build