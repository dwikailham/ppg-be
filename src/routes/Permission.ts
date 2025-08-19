import express from 'express';
import { getPermissions, createPermission } from '../controllers/Permission';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/permission', accessValidation, getPermissions);
router.post('/permission', accessValidation, createPermission);

export default router;
