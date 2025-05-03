import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import arcjetMiddleware from './middleware/arcjetMiddleware.js';
import { corsOptions } from './middleware/corsOptions.js';
import { errorHandler } from './middleware/errorHandler.js';

import passport from './config/passport.js';
import './config/passportGoogle.js';

import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';

const app = express();

app.use(express.json());
app.use(corsOptions);
app.use(logger('dev'));
app.use(arcjetMiddleware);
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRouter);


app.use('/api/users', usersRouter);
// app.use('/api/profile', profileRouter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get('/', (req, res) => {
  res.send('Welcome to the Attendance Syatem API');
});

app.use(errorHandler);

export default app;
