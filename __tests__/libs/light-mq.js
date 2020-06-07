import Axios from 'axios';
import Server from '../../src/libs/server';
import Client from '../../src/libs/client';

const runTest = (test) => async () => {
  const lightMQ = await Server.create();
  const httpServer = await lightMQ.listen();

  const port = httpServer.address().port;
  const endpoint = `http://127.0.0.1:${port}`;

  const client = Client.create(endpoint);

  try {
    await test(client);
  } finally {
    httpServer.close();
  }
};

test(
  'Test runTest.',
  runTest(async (client) => {}),
);

test(
  'Get default configs.',
  runTest(async (client) => {
    const config = await client.config.get('topic-x');

    expect(config['speed-limit']).toBe(1000);
    expect(config['retry-interval']).toBe(60000);
  }),
);

test(
  'Set configs.',
  runTest(async (client) => {
    const ret = await client.config.set('topic-x', {
      'speed-limit': 2000,
      'retry-interval': 600000,
    });

    expect(ret).toBe(null);

    const config = await client.config.get('topic-x');

    expect(config['speed-limit']).toBe(2000);
    expect(config['retry-interval']).toBe(600000);
  }),
);

test(
  'Submit message.',
  runTest(async (client) => {
    const id = 'user-1';
    const payload = {
      user: 1,
      succ: true,
    };

    const ret = await client.message.publish('topic-login', id, payload);

    expect(ret).toBe(null);
  }),
);

test(
  'Subscribe message.',
  runTest(async (client) => {
    let results = [];

    const cancel = client.message.subscribe(
      'topic-login',
      async (message_id, payload) => {
        results.push({
          message_id,
          payload,
        });
      },
    );

    for (let i = 0; i < 10; i++) {
      const ret = await client.message.publish('topic-login', i, {
        user_id: i.toString(),
        succ: true,
      });

      expect(ret).toBe(null);
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(results);

    expect(results.length).toBe(10);

    cancel();
  }),
);
