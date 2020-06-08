# LightMQ

[![npm (scoped)](https://img.shields.io/npm/v/@aguang/lightmq)](https://www.npmjs.com/package/@aguang/lightmq)
[![npm](https://img.shields.io/npm/dm/@aguang/lightmq)](https://www.npmjs.com/package/@aguang/lightmq)
[![Docker Cloud Build Status](https://img.shields.io/docker/cloud/build/lightmq/lightmq)](https://hub.docker.com/r/lightmq/lightmq/builds)
[![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/lightmq/lightmq)](https://hub.docker.com/r/lightmq/lightmq)

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

### Javascript.

```javascript
import LightMQ from 'light-mq/libs/client';

lightMQ.create().then((lightMQ) => {
  
  
  // Get configs.
  lightMQ.config.get('topic-name').then(config => {
  
    // Speed limit of a given topic, default: 1000
    // (transactions per second).
    console.log(config['speed-limit']);
    
    // Retry interval, default: 60000 (seconds).
    console.log(config['retry-interval']);
  });
  
  
  // Set configs.
  lightMQ.config.set('topic-name', {
    'speed-limit': 100,   // 100 (transactions per second).
    'retry-interval': 10, // 10 (seconds).
  }).then(() => {
    
    console.log('Set config success.');
  });
  
  
  // Publish messages.
  const message_id = 'user-login-message-1';
  const payload = {
    userid: '1',
    success: true,
    device: 'ios',
  };
  lightMQ.message.publish('topic-name', message_id, payload)
    .then(() => {
    
      console.log('Publish success.');
    });
  
  
  // Subscribe messages.
  const cancel = lightMQ.message.subscribe('topic-name',
  	(message_id, payload) => {
    
      console.log(message_id, payload);

      // If there is any asychronized processing, make sure it
    	// should be wrapped into a Promised object to be returned;
    	// Or you can pass-in a async function directly.

      return somePromisedOperation(payload);
    });
  
  // Stop subscribing 10 seconds later.
  setTimeout(cancel, 10000);
});
```

### HTTP.

```bash
# Get configs.
curl --header "Content-Type: application/json" \
     --request GET \
       http://127.0.0.1:8080/config/topic-name


# Set configs.
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"speed-limit": 1}' \
       http://127.0.0.1:8080/config/topic-name


# Publish messages.
curl --header "Content-Type: application/json" \
     --request POST \
     --data '{"userid": "1", "success": true, "device": "ios"}' \
       http://127.0.0.1:8080/message/topic-name/message_id 


# Subscribe for messages, it is a blocking query until there
# is a message available and it meets the spped limit of the
# subscribed topic.
curl --header "Content-Type: application/json" \
     --request GET \
       http://127.0.0.1:8080/message/topic-name
```
