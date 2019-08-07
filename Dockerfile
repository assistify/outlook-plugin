FROM node:10-alpine as builder

WORKDIR /app

ADD assets /app/assets
ADD src /app/src
ADD package.json /app/package.json
ADD webpack.config.js /app/webpack.config.js

RUN npm install
RUN npm run build


FROM node:10-alpine

WORKDIR /app

COPY --from=builder /app/dist /app/dist
ADD index.js /app/index.js
ADD package.json /app/package.json
ADD assets /app/assets
RUN npm install --production

CMD npm start
