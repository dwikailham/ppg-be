import express from 'express';
import {
  createKelompok,
  deleteKelompok,
  getAllKelompok,
  getKelompokById,
  updateKelompok,
} from '../controllers/Kelompok';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/kelompok', accessValidation, getAllKelompok);
router.get('/kelompok/detail/:id', accessValidation, getKelompokById);
router.post('/kelompok', accessValidation, createKelompok);
router.patch('/kelompok/update/:id', accessValidation, updateKelompok);
router.delete('/kelompok/delete/:id', accessValidation, deleteKelompok);

export default router;
