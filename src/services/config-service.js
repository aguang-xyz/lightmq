import StoreService from './store-service';

const DEFAULT_CONFIGS = {
  'speed-limit': 1000,
  'retry-interval': 60000,
};

let configCache = {};

const get = (topic, key, defaultValue = null) => {
  if (!configCache[topic]) {
    return defaultValue;
  }

  return configCache[topic][key] || defaultValue;
};

const set = (topic, key, value) =>
  StoreService.insertConfig(topic, key, value).then(() => {
    configCache[topic] = configCache[topic] || {};
    configCache[topic][key] = value;
  });

const ConfigService = {
  init: () =>
    StoreService.getAllConfigs().then((configs) => {
      configs.forEach(({ topic, key, value }) => {
        configCache[topic] = configCache[topic] || {};
        configCache[topic][key] = value;
      });
    }),

  getAll: (topic) =>
    Object.entries(DEFAULT_CONFIGS)
      .map(([key, defaultValue]) => [key, get(topic, key, defaultValue)])
      .reduce((ret, [key, value]) => Object.assign(ret, { [key]: value }), {}),

  getSpeedLimit: (topic) =>
    get(topic, 'speed-limit', DEFAULT_CONFIGS['speed-limit']),

  getRetryInterval: (topic) =>
    get(topic, 'retry-interval', DEFAULT_CONFIGS['retry-interval']),

  setAll: (topic, values) =>
    Promise.all(
      Object.entries(values)
        .filter(([key, value]) => Object.keys(DEFAULT_CONFIGS).includes(key))
        .map(([key, value]) => set(topic, key, value)),
    ),
};

export default ConfigService;
