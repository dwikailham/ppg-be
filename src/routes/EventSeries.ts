import express from 'express';
import {
  createEventSeries,
  deleteEventSeries,
  getEventSeries,
  getEventSeriesDetail,
} from '../controllers/EventSeries';
import { accessValidation } from '../middleware';

const router = express.Router();

router.get('/event-series', accessValidation, getEventSeries);
router.get('/event-series/detail/:id', accessValidation, getEventSeriesDetail);
router.post('/event-series', accessValidation, createEventSeries);
router.delete('/event-series/delete/:id', accessValidation, deleteEventSeries);

export default router;
