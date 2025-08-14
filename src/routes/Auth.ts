import express from 'express';
import { Login, getMe } from '../controllers/Auth';
import { accessValidation } from '../middleware';

const router = express.Router();

router.post('/login', Login);
router.post('/me', accessValidation, getMe);

export default router;
