import express from 'express';
import {
  getAttendances,
  getAttendanceDetail,
  createOrUpdateAttendance,
  updateAttendance,
  deleteAttendance,
  bulkCreateAttendance,
} from '../controllers/Attendance';

const router = express.Router();

router.get('/attendance', getAttendances);
router.get('/attendance/:id', getAttendanceDetail);
router.post('/attendance', createOrUpdateAttendance);
router.post('/attendance/bulk', bulkCreateAttendance);
router.put('/attendance/:id', updateAttendance);
router.delete('/attendance/:id', deleteAttendance);

export default router;
