import cors from 'cors';

export const corsOptions = cors({
  origin: ['*', 'http://localhost:5174'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
