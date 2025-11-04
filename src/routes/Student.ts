import express from 'express';
import {
  getAllStudents,
  createStudent,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/Student';
import { accessValidation, scopeFilterMiddleware } from '../middleware';

const router = express.Router();

router.get(
  '/student',
  accessValidation,
  scopeFilterMiddleware('student'),
  getAllStudents
);
router.get('/student/detail/:id', accessValidation, getStudentById);
router.post('/student', accessValidation, createStudent);
router.patch('/student/update/:id', accessValidation, updateStudent);
router.delete('/student/delete/:id', accessValidation, deleteStudent);

export default router;
