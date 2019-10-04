import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetingController from './app/controllers/MeetingController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = new multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meeting', MeetingController.index);
routes.post('/meeting', MeetingController.store);
routes.put('/meeting', MeetingController.update);
routes.delete('/meeting', MeetingController.delete);

export default routes;
