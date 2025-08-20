import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db';
import {
  UserRoute,
  AuthRoute,
  DesaRoute,
  KelompokRoute,
  StudentRoute,
} from './routes';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;

db.authenticate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Tidak dapat terkoneksi dengan database');
  });

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());
app.use(AuthRoute);
app.use(UserRoute);
app.use(DesaRoute);
app.use(KelompokRoute);
app.use(StudentRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript + Express!');
});
