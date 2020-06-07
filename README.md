# LightMQ

[![npm (scoped)](https://img.shields.io/npm/v/@aguang/lightmq)](https://www.npmjs.com/package/@aguang/lightmq)
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/lightmq/lightmq)](https://hub.docker.com/r/lightmq/lightmq/builds)
[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/lightmq/lightmq)](https://hub.docker.com/r/lightmq/lightmq)
[![GitHub stars](https://img.shields.io/github/stars/aguang-xyz/lightmq?style=social)](https://github.com/aguang-xyz/lightmq)

An embeddable lightweight MQ implementation based on HTTP protocol.

## Deploy server.

### Integrate with Express.

```javascript
import LightMQ from 'light-mq/libs/server';
import Express from 'express';

LightMQ.create().then((lightMQ) => {

  const app = Express();
  
  app.use('/light-mq', lightMQ);

  app.listen(args.port);
});
```

### Docker.

```bash
docker pull lightmq/lightmq
docker run -it -p 8080:8080 lightmq
```

### Command line.

```bash
npm install lightmq -g

lightmq
```

## Client.

Comming soon.