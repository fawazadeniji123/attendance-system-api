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
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
  
      if (!user) {
        return res
          .status(401)
          .json({
            success: false,
            message: info?.message || 'Authentication failed',
          });
      }
  
      req.user = user;
      next();
    })(req, res, next);
  },
  signIn
);


authRouter.post('/token', refreshAccessToken);

authRouter.post('/sign-out', signOut);

export default authRouter;
