import { Router } from 'express';

import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetingController from './app/controllers/MeetingController';
import RegistrationController from './app/controllers/RegistrationController';
import ListMeetingController from './app/controllers/ListMeetingController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/meetings', MeetingController.index);
routes.post('/meetings', MeetingController.store);
routes.put('/meetings', MeetingController.update);
routes.delete('/meetings/:id', MeetingController.delete);

routes.get('/registrations', RegistrationController.index);
routes.post('/registrations', RegistrationController.store);

routes.get('/meetings/all', ListMeetingController.index);

export default routes;
