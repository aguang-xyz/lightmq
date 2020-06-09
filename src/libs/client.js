import Axios from 'axios';

const Client = {
  create: ({ baseURL, socketPath }) => {
    baseURL = baseURL || (socketPath ? 'http:' : 'http://127.0.0.1:8080/');

    const client = Axios.create({
      baseURL,
      socketPath,
      validateStatus: (status) => status == 200,
    });

    return {
      config: {
        get: (topic) => client.get(`/config/${topic}`).then((res) => res.data),
        set: (topic, fields) =>
          client.post(`/config/${topic}`, fields).then(() => null),
      },
      message: {
        publish: (topic, message_id, content) =>
          client
            .post(`/message/${topic}/${message_id}`, content)
            .then(() => null),

        subscribe: (topic, callback) => {
          let canceled = false;

          const fetch = async () => {
            try {
              const res = await client.get(`/message/${topic}`);

              const message_id = res.headers['x-message-id'];
              const payload = res.data;

              if (!canceled) {
                await callback(message_id, payload);

                client.delete(`/message/${topic}/${message_id}`);
              }
            } catch (e) {
              // TODO
            } finally {
              if (!canceled) fetch();
            }
          };

          fetch();

          return () => (canceled = false);
        },
      },
    };
  },
};

export default Client;
