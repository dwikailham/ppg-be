import express from 'express';
import {
  createDesa,
  deleteDesa,
  getDesaById,
  getAllDesa,
  updateDesa,
} from '../controllers/Desa';
import { accessValidation } from '../middleware';
import { get } from 'http';

const router = express.Router();

router.get('/desa', accessValidation, getAllDesa);
router.get('/desa/detail/:id', accessValidation, getDesaById);
router.post('/desa', accessValidation, createDesa);
router.patch('/desa/update/:id', accessValidation, updateDesa);
router.delete('/desa/delete/:id', accessValidation, deleteDesa);

export default router;
