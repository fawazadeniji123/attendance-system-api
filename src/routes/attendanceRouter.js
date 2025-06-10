import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../controllers/attendanceController.js';
import { validateAttendance } from '../middleware/attendanceMiddleware.js';

const attendanceRouter = express.Router();
attendanceRouter.get(
  '/:courseId',
  passport.authenticate('jwt', { session: false }),
  getAttendance
);
attendanceRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  createAttendance
);
attendanceRouter.put(
  '/:attendanceId',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  updateAttendance
);
attendanceRouter.delete(
  '/:attendanceId',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  deleteAttendance
);

export default attendanceRouter;
