import Server from './libs/server';

Server.create({
  store: process.env.STORE,
}).then((app) => app.listen(process.env.PORT || 8080));
