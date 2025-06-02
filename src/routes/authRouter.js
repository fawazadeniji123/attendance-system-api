import express from 'express';
import passport from 'passport';
import {
  signIn,
  signUp,
  refreshAccessToken,
  signOut,
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/sign-up', signUp);

authRouter.post(
  '/sign-in',
  passport.authenticate('local', {
    failureMessage: true,
    session: false,
  }),
  signIn
);

authRouter.post('/token', refreshAccessToken);

authRouter.post('/sign-out', signOut);

export default authRouter;
