FROM node:10-alpine

WORKDIR /app

ADD src /app/src
ADD index.js /app/index.js
ADD package.json /app/package.json

RUN npm install --production
RUN npm run build

ADD dist /app/dist

CMD npm start
