import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { corsOptions } from './middleware/corsOptions.js';
import { errorHandler } from './middleware/errorHandler.js';

import passport from './config/passport.js';

import authRouter from './routes/authRouter.js';
import usersRouter from './routes/usersRouter.js';
import courseRoutes from './routes/courseRouter.js';
import attendanceRoutes from './routes/attendanceRouter.js';
// import profileRouter from './routes/profileRouter';

const app = express();

app.use(express.json());
app.use(corsOptions);
app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(passport.initialize());

// Routes
app.use('/auth', authRouter);
app.use('/courses', courseRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/users', usersRouter);
// app.use('/api/profile', profileRouter);

app.get('/health-check', (_req, res) => {
  res.json({
    status: 'ok',
  });
});

app.get('/', (_req, res) => {
  res.send('Welcome to the Attendance System API');
});

app.use(errorHandler);

export default app;
