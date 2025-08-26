import express from 'express';
import { createRole, getRoles, updateRole } from '../controllers/Role';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/role', accessValidation, getRoles);
router.post('/role', accessValidation, createRole);
router.patch('/role/update/:id', accessValidation, updateRole);

export default router;
