import 'regenerator-runtime/runtime';

import StoreService from './store-service';
import ConfigService from './config-service';

let idx = 0;
let waitingList = [];

const schedule = async function () {
  try {
    const length = waitingList.length;

    let onAllocatedMap = {};

    for (let i = 0; i < length; i++) {
      const { topic, onAllocated } = waitingList.shift();

      onAllocatedMap[topic] = onAllocatedMap[topic] || [];

      onAllocatedMap[topic].push(onAllocated);
    }

    for (let topic in onAllocatedMap) {
      const speedLimit = ConfigService.getSpeedLimit(topic);

      let limit = parseInt(speedLimit / 100);

      if (idx < speedLimit % 100) {
        limit = limit + 1;
      }

      const messages = await StoreService.getMessages(topic, limit, Date.now());

      for (let i = 0, j = 0; i < onAllocatedMap[topic].length; i++) {
        if (j < messages.length) {
          const { id, payload, retryTimestamp } = messages[j];

          if (onAllocatedMap[topic][i](id, payload)) {
            StoreService.updateMessage(
              topic,
              id,
              retryTimestamp + ConfigService.getRetryInterval(topic),
            );

            j++;
          }
        } else {
          waitingList.push({ topic, onAllocated: onAllocatedMap[topic][i] });
        }
      }
    }

    idx = (idx + 1) % 100;
  } catch (e) {
    console.error(e.message);
  }

  setTimeout(schedule, 10);
};

const MessageService = {
  init: () => schedule(),

  subscribe: (topic, onAllocated) => waitingList.push({ topic, onAllocated }),

  publish: (topic, id, payload) =>
    StoreService.insertMessage(topic, id, payload, Date.now()),

  delete: (topic, id) => StoreService.deleteMessage(topic, id),
};

export default MessageService;
