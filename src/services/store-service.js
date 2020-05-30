import { Database } from 'sqlite3';

let database;

const invoke = (f, sql, ...params) =>
  new Promise((resolve, reject) => {
    f(sql, ...params, (err, ret) => {
      if (process.env.DEBUG === 'true') {
        let output = `[store#invoke] ${sql} --`;

        if (params.length > 0) {
          output += ` params = ${JSON.stringify(params)}`;
        }

        if (err) output += ` err = ${err.message}`;

        if (ret) output += ` ret = ${JSON.stringify(ret)}`;

        console.log(output);
      }

      err ? reject(err) : resolve(ret);
    });
  });

const run = (sql, ...params) =>
  invoke(database.run.bind(database), sql, ...params);

const all = (sql, ...params) =>
  invoke(database.all.bind(database), sql, ...params);

const StoreService = {
  init: function (path) {
    database = new Database(path || ':memory:');

    return Promise.all([
      run(
        'CREATE TABLE IF NOT EXISTS `message_queue`(' +
          '`topic` TEXT, ' +
          '`id` TEXT, ' +
          '`payload` TEXT, ' +
          '`retryTimestamp` INT, ' +
          'UNIQUE(`topic`, `id`) ON CONFLICT REPLACE)',
      ),
      run(
        'CREATE TABLE IF NOT EXISTS `topic_config` (' +
          '`topic` TEXT, ' +
          '`key` TEXT, ' +
          '`value` TEXT, ' +
          'UNIQUE(`topic`, `key`) ON CONFLICT REPLACE)',
      ),
    ]);
  },

  insertMessage: (topic, id, payload, retryTimestamp) =>
    run(
      'INSERT INTO `message_queue` VALUES (?, ?, ?, ?)',
      topic,
      id,
      JSON.stringify(payload),
      retryTimestamp,
    ),

  getMessages: (topic, limit, retryTimestamp) =>
    all(
      'SELECT * FROM `message_queue` WHERE ' +
        '`topic` = ? AND ' +
        '`retryTimestamp` <= ? ' +
        'LIMIT ?',
      topic,
      retryTimestamp,
      limit,
    ).then((messages) =>
      messages.map(({ topic, id, payload, retryTimestamp }) => ({
        topic,
        id,
        payload: JSON.parse(payload),
        retryTimestamp,
      })),
    ),

  updateMessage: (topic, id, retryTimestamp) =>
    run(
      'UPDATE `message_queue` SET `retryTimestamp` = ? ' +
        'WHERE `topic` = ? AND `id` = ?',
      retryTimestamp,
      topic,
      id,
    ),

  deleteMessage: (topic, id) =>
    run(
      'DELETE FROM `message_queue` WHERE `topic` = ? AND `id` = ?',
      topic,
      id,
    ),

  insertConfig: (topic, key, value) =>
    run(
      'INSERT INTO `topic_config` VALUES(?, ?, ?)',
      topic,
      key,
      JSON.stringify(value),
    ),

  getAllConfigs: () =>
    all('SELECT * FROM `topic_config`').then((configs) =>
      configs.map(({ topic, key, value }) => ({
        topic,
        key,
        value: JSON.parse(value),
      })),
    ),
};

export default StoreService;
