import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  httpGetAllCourses,
  httpCreateCourse,
  httpUpdateCourse,
  httpDeleteCourse,
  httpEnrollInCourse,
  httpGetCourseEnrollments,
} from '../controllers/courseController.js';

const coursesRouter = express.Router();

coursesRouter.get(
  '/',
  // passport.authenticate('jwt', { session: false }),
  // checkPermission('view:courses'),
  httpGetAllCourses
);

coursesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('create:courses'),
  httpCreateCourse
);

coursesRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('edit:courses'),
  httpUpdateCourse
);

coursesRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('delete:courses'),
  httpDeleteCourse
);

coursesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('create:courses'),
  httpCreateCourse
);

coursesRouter.post(
  '/:id/enroll',
  passport.authenticate('jwt', { session: false }),
  checkPermission('enroll:courses'),
  httpEnrollInCourse
);

coursesRouter.get(
  '/:id/enrollments',
  passport.authenticate('jwt', { session: false }),
  // checkPermission('manage:enrollments'),
  httpGetCourseEnrollments
);

export default coursesRouter;
