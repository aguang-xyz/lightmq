import Axios from 'axios';
import Server from '../../src/libs/server';

test('a + b', async () => {
  const mqServer = await Server.create();
  const httpServer = await mqServer.listen();

  console.log(httpServer.address().port);
});
