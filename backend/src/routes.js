const express = require('express');
const DevController = require('./controllers/DevController');
const LikeController = require('./controllers/LikeController');
const DislikeController = require('./controllers/DislikeController');
const { validate, validateParams, devSchema, interactionSchema } = require('./middlewares/validation');

const routes = express.Router();

routes.get('/devs', DevController.index);
routes.post('/devs', validate(devSchema), DevController.store);
routes.post('/devs/:devId/likes', validateParams(interactionSchema), LikeController.store);
routes.post('/devs/:devId/dislikes', validateParams(interactionSchema), DislikeController.store);

module.exports = routes;