import cors from 'cors';

export const corsOptions = cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://attendance-system-red.vercel.app/',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
