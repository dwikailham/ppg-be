import express from 'express';
import {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/Student';
import { accessValidation, scopeFilterMiddleware } from '../middleware';
import { SCOPE_FILTER_MIDDLEWARE } from '../utils/constants';

const router = express.Router();

router.get(
  '/student',
  accessValidation,
  scopeFilterMiddleware(SCOPE_FILTER_MIDDLEWARE.STUDENT),
  getAllStudents
);
router.get('/student/detail/:id', accessValidation, getStudentById);
router.post('/student', accessValidation, createStudent);
router.patch('/student/update/:id', accessValidation, updateStudent);
router.delete('/student/delete/:id', accessValidation, deleteStudent);

export default router;
