import Express from 'express';
import Morgan from 'morgan';
import Cors from 'cors';
import StoreService from '../services/store-service';
import ConfigService from '../services/config-service';
import MessageService from '../services/message-service';
import configRouter from '../routers/config-router';
import messageRouter from '../routers/message-router';

const Server = {
  create: ({ store, log } = {}) =>
    StoreService.init(store)
      .then(() => ConfigService.init())
      .then(() => MessageService.init())
      .then(() => {
        const app = new Express();

        if (log) {
          app.use(Morgan('tiny'));
        }

        app.use(
          Cors({
            exposedHeaders: ['x-message-id'],
          }),
        );

        app.use('/config', configRouter);
        app.use('/message', messageRouter);

        let _listen = app.listen.bind(app);

        app.listen = (...args) =>
          new Promise((resolve) => {
            let server = _listen(...args, () => {
              resolve(server);
            });
          });

        return app;
      }),
};

export default Server;
