import Express from 'express';
import MessageService from '../services/message-service';

const messageRouter = Express.Router();

messageRouter.get('/:topic', (req, res) => {
  let waiting = true;

  req.on('close', () => {
    waiting = false;
  });

  MessageService.subscribe(req.params.topic, (id, payload) => {
    if (!waiting) {
      return false;
    }

    res.set('x-message-id', id).json(payload);

    return true;
  });
});

messageRouter.post('/:topic/:id', Express.json(), (req, res) =>
  MessageService.publish(req.params.topic, req.params.id, req.body).then(() =>
    res.end(),
  ),
);

messageRouter.delete('/:topic/:id', (req, res) =>
  MessageService.delete(req.params.topic, req.params.id).then(() => res.end()),
);

export default messageRouter;
