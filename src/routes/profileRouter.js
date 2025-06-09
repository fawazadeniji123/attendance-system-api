import express from 'express';
import passport from '../config/passport.js';
import {
  httpGetProfile,
  httpUpdateProfile,
  httpDeleteProfile,
} from '../controllers/profileController.js';

const profileRouter = express.Router();
profileRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  httpGetProfile
);
profileRouter.put(
  '/',
  passport.authenticate('jwt', { session: false }),
  httpUpdateProfile
);
profileRouter.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  httpDeleteProfile
);
export default profileRouter;