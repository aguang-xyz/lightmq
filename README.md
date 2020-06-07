# LightMQ

An embeddable lightweight MQ implementation based on HTTP protocol.

## Deploy server.

### Integrate with Express.

```javascript
import MQServer from 'light-mq/libs/server';
import Express from 'express';

const app = Express();

app.use('/light-mq', MQServer.create());

app.listen(8080);
```

### Docker.

```bash
docker pull lightmq/lightmq
docker run -it -p 8080:8080 lightmq
```

## Client.
