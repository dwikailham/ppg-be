import { Request, Response } from 'express';
import { EventSeries, Event } from '../models';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';
import { sendError, sendSuccess } from '../utils/commons';

export const getEventSeries = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await EventSeries.findAndCountAll({
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Event,
          as: 'events',
        },
      ],
    });

    return res.status(HTTP_STATUS.OK).json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const getEventSeriesDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eventSeries = await EventSeries.findByPk(id, {
      include: [
        {
          model: Event,
          as: 'events',
        },
      ],
    });

    if (!eventSeries) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    }

    return res.status(HTTP_STATUS.OK).json(eventSeries);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createEventSeries = async (req: Request, res: Response) => {
  try {
    const { name, description, start_date, end_date } = req.body;

    if (!name) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ success: false, message: 'Name is required' });
    }

    const newSeries = await EventSeries.create({
      series_name: name,
      description,
      start_date,
      end_date,
    });

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Event series created successfully',
      data: newSeries,
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const updateEventSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, start_date, end_date } = req.body;

    const eventSeries = await EventSeries.findByPk(id);
    if (!eventSeries) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    }

    await eventSeries.update({
      series_name: name,
      description,
      start_date,
      end_date,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Event series updated successfully',
      data: eventSeries,
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteEventSeries = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const eventSeries = await EventSeries.findByPk(id);
    if (!eventSeries) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: 'Event series not found' });
    }

    await eventSeries.destroy();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Event series deleted successfully',
    });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
