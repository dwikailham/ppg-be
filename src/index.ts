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
  PermissionRoute,
  RoleRoute,
  ScopeRoute,
} from './routes';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;

// (async () => {
//   try {
//     await db.sync({ alter: true });
//     console.log('Synced databases!');
//   } catch (err) {
//     console.error('Failed to sync DB:', err);
//   }
// })();

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
app.use(PermissionRoute);
app.use(RoleRoute);
app.use(ScopeRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript + Express!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
