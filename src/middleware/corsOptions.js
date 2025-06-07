import cors from 'cors';

export const corsOptions = cors({
  origin: ['*', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
