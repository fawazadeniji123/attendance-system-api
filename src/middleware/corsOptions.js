import cors from 'cors';

export const corsOptions = cors({
  origin: [
    'https://attendance-system-red.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
