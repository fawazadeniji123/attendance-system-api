import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import passportJWT from 'passport-jwt';
import bcrypt from 'bcrypt';
import { config as env } from './env.js';
import { findUserById, findUserWithPassword } from '../models/authModel.js';

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email', // Default is 'username'
    passwordField: 'password', // Default is 'password'
  },
  async (email, password, done) => {
    try {
      let user = await findUserWithPassword(email);
      if (!user)
        return done(null, false, { error: 'Incorrect email or password.' });

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password.hashed
      );
      if (!isPasswordValid)
        return done(null, false, { error: 'Incorrect email or password.' });

      user = await findUserById(user.id);
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies['accessToken'];
      }
      return token;
    },
  ]),
  secretOrKey: env.ACCESS_TOKEN_SECRET,
  jsonWebTokenOptions: {
    expiresIn: '15m',
  },
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  try {
    const user = await findUserById(jwtPayload.userId);
    if (!user) {
      return done(null, false, { error: 'User not found' });
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export default passport;
