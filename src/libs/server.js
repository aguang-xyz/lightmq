import Express from 'express';
import Morgan from 'morgan';
import StoreService from '../services/store-service';
import ConfigService from '../services/config-service';
import MessageService from '../services/message-service';
import configRouter from '../routers/config-router';
import messageRouter from '../routers/message-router';

const Server = {
  create: ({ store }) =>
    StoreService.init(store)
      .then(() => ConfigService.init())
      .then(() => MessageService.init())
      .then(() => {
        const app = new Express();

        app.use(Morgan('tiny'));

        app.use('/config', configRouter);
        app.use('/message', messageRouter);

        return app;
      }),
};

export default Server;
