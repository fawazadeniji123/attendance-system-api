import express from 'express';
import passport from 'passport';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import {
  httpGetAllCourses,
  httpGetCourseById,
  httpGetCoursesByLecturerId,
  httpGetAvailableCoursesByStudentId,
  httpCreateCourse,
  httpUpdateCourse,
  httpDeleteCourse,
  httpEnrollInCourse,
  httpUnenrollInCourse,
  httpGetCourseEnrollments,
  httpGetStudentEnrollments,
} from '../controllers/courseController.js';

const coursesRouter = express.Router();

coursesRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpGetAllCourses
);

coursesRouter.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'lecturer', 'student']),
  httpGetCourseById
);

coursesRouter.get(
  '/:lecturerId/lecturer',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'lecturer']),
  httpGetCoursesByLecturerId
);

coursesRouter.get(
  '/:studentId/available',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'lecturer', 'student']),
  httpGetAvailableCoursesByStudentId
);

coursesRouter.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpCreateCourse
);

coursesRouter.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpUpdateCourse
);

coursesRouter.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  checkPermission('admin'),
  httpDeleteCourse
);

coursesRouter.post(
  '/:id/enroll',
  passport.authenticate('jwt', { session: false }),
  checkPermission('student'),
  httpEnrollInCourse
);

coursesRouter.post(
  '/:id/unenroll',
  passport.authenticate('jwt', { session: false }),
  checkPermission('student'),
  httpUnenrollInCourse
);

coursesRouter.get(
  '/:studentId/enrollments',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'student']),
  httpGetStudentEnrollments
);

coursesRouter.get(
  '/:courseId/enrollments/course',
  passport.authenticate('jwt', { session: false }),
  checkPermission(['admin', 'lecturer']),
  httpGetCourseEnrollments
);

export default coursesRouter;
