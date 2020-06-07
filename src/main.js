#!/usr/bin/env node

import Server from './libs/server';
import Args from 'command-line-args';
import Usage from 'command-line-usage';

const options = [
  {
    name: 'port',
    alias: 'p',
    type: Number,
    description: 'HTTP port',
    defaultValue: 8080,
  },
  {
    name: 'store',
    alias: 's',
    type: String,
    description: 'The path to persist message data.',
  },
  {
    name: 'log',
    alias: 'l',
    type: Boolean,
    description: 'Enable logs.',
    defaultValue: true,
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Show help',
  },
];

const sections = [
  {
    header: 'LightMQ',
    content: 'A lightweight MQ implementation based on HTTP protocol.',
  },
  {
    header: 'Synopsis',
    content: 'lightmq <options>',
  },
  {
    header: 'Options',
    optionList: options,
  },
];

const args = Args(options),
  usage = Usage(sections);

if (args.help) {
  console.log(usage);
} else {
  Server.create({
    store: args.store,
    log: args.log,
  })
    .then((app) => app.listen(args.port))
    .then((server) =>
      process.on('SIGINT', () => {
        server.close(() => process.exit(0));
      }),
    );
}
