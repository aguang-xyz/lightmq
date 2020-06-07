# LightMQ

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