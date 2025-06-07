import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  httpGetAllUsers,
  httpGetLecturerUsers,
  httpGetStudentUsers,
  httpGetRecentUsers,
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
  checkPermission(['admin']),
  httpGetAllUsers
);

usersRouter.get(
  '/lecturers',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin']),
  httpGetLecturerUsers
);

usersRouter.get(
  '/students',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin']),
  httpGetStudentUsers
);

usersRouter.get(
  '/recent',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin']),
  httpGetRecentUsers
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

usersRouter.patch(
  '/:id/approve',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpApproveUser
);

usersRouter.patch(
  '/:id/reject',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpUpdateUser
);

export default usersRouter;
