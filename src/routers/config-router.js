import Express from 'express';
import ConfigService from '../services/config-service';

const configRouter = Express.Router();

configRouter.get('/:topic', (req, res) =>
  res.json(ConfigService.getAll(req.params.topic)),
);

configRouter.post('/:topic', Express.json(), (req, res) =>
  ConfigService.setAll(req.params.topic, req.body).then(() => res.end()),
);

export default configRouter;
