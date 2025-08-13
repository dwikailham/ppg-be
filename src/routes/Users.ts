import express from 'express';
import {
  getList,
  getById,
  createData,
  updateData,
  deleteData,
} from '../controllers/Users';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/users', accessValidation, getList);
router.get('/users/detail/:id', accessValidation, getById);
router.post('/users', accessValidation, createData);
router.patch('/users/update/:id', accessValidation, updateData);
router.delete('/users/delete/:id', accessValidation, deleteData);

export default router;
