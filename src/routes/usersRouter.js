import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  httpGetAllUsers,
  httpGetUserById,
  httpUpdateUser,
  httpDeleteUser,
  httpUploadAvatar,
  httpApproveUser,
} from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'lecturer']),
  httpGetAllUsers
);

usersRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  httpGetUserById
);

usersRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  httpUpdateUser
);

usersRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpDeleteUser
);

usersRouter.post(
  '/:id/upload-avatar',
  passport.authenticate('jwt', { session: false }),
  httpUploadAvatar
);

usersRouter.put(
  '/:id/approve',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpApproveUser
);

usersRouter.put(
  '/:id/reject',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpUpdateUser
);

export default usersRouter;
