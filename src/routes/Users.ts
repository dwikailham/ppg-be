import express from 'express';
import {
  getList,
  getById,
  createData,
  updateData,
  deleteData,
} from '../controllers/Users';

const router = express.Router();

router.get('/users', getList);
router.get('/users/detail/:id', getById);
router.post('/users', createData);
router.patch('/users/update/:id', updateData);
router.delete('/users/delete/:id', deleteData);

export default router;
