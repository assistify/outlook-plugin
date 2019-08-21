FROM node:10-alpine

WORKDIR /app

ADD . /app

RUN npm install --production

CMD npm start
