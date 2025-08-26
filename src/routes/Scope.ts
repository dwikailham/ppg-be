import express from 'express';
import {
  addUserScope,
  deleteUserScope,
  getUserScopes,
} from '../controllers/Scope';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/scope', accessValidation, getUserScopes);
router.post('/scope', accessValidation, addUserScope);
router.patch('/scope/update/:id', accessValidation, deleteUserScope);

export default router;
