import express from 'express';
import {
  createDesa,
  deleteDesa,
  getDesaById,
  getAllDesa,
  updateDesa,
} from '../controllers/Desa';
import { accessValidation, roleMiddleware } from '../middleware';

const router = express.Router();

router.get('/desa', accessValidation, getAllDesa);
router.get('/desa/detail/:id', accessValidation, getDesaById);
router.post('/desa', accessValidation, roleMiddleware(['Admin']), createDesa);
router.patch('/desa/update/:id', accessValidation, updateDesa);
router.delete('/desa/delete/:id', accessValidation, deleteDesa);

export default router;
