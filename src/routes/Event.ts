import express from 'express';
import {
  createEvent,
  deleteEvent,
  getEventDetail,
  getEvents,
} from '../controllers/Event';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/event', accessValidation, getEvents);
router.get('/event/detail/:id', accessValidation, getEventDetail);
router.post('/event', accessValidation, createEvent);
router.delete('/event/delete/:id', accessValidation, deleteEvent);

export default router;
