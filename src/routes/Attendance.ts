import express from 'express';
import {
  getAttendances,
  getAttendanceDetail,
  createOrUpdateAttendance,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendance,
} from '../controllers/Attendance';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/attendance', accessValidation, getAttendances);
router.get('/attendance/:id', accessValidation, getAttendanceDetail);
router.post('/attendance', accessValidation, createOrUpdateAttendance);
router.post('/attendance/bulk', accessValidation, bulkCreateAttendance);
router.put('/attendance/:id', accessValidation, updateAttendance);
router.delete('/attendance/:id', accessValidation, deleteAttendance);

export default router;
