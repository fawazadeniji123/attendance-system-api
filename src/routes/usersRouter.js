import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  httpGetAllUsers,
  httpGetUserById,
  httpUpdateUser,
  httpDeleteUser,
  httpUploadAvatar,
} from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('list:users'),
  httpGetAllUsers
);

usersRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('view:profile'),
  httpGetUserById
);

usersRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('edit:users'),
  httpUpdateUser
);

usersRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('delete:users'),
  httpDeleteUser
);

usersRouter.post(
  '/:id/upload-avatar',
  passport.authenticate('jwt', { session: false }),
  checkPermission('edit:users'),
  httpUploadAvatar
);

export default usersRouter;
