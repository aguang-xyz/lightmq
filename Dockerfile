FROM node:12-alpine

WORKDIR /usr/src/lightmq

ADD src ./src

COPY .babelrc package*.json ./

RUN npm install

RUN npm run build

RUN npm link

RUN mkdir -p /data/lightmq

EXPOSE 8080

CMD lightmq -p 8080 -s /data/lightmq/lightmq.store
