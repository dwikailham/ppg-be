import { Request, Response } from 'express';
import { Event, DesaModel, KelompokModel, EventSeries } from '../models';
import { sendError, sendSuccess } from '../utils/commons';
import { UserWithRelations } from './Auth';
import { HTTP_MESSAGE, HTTP_STATUS, SCOPE_TYPE } from '../utils/constants';

interface ValidationRequest extends Request {
  user_data: UserWithRelations;
}

export const createEvent = async (req: Request, res: Response) => {
  const validationRequest = req as ValidationRequest;
  try {
    const { series_id, event_date, location, scope_type, scope_id } = req.body;
    const user = validationRequest.user_data; // payload JWT user

    if (!user || !user.scopes || user.scopes.length === 0) {
      return sendError(
        res,
        HTTP_STATUS.FORBIDDEN,
        'User has no scope assigned'
      );
    }

    const newEvent = await Event.create({
      series_id,
      event_date,
      location,
      scope_type,
      created_by: user.id || 0,
      scope_id,
    });

    sendSuccess(res, HTTP_MESSAGE.CREATED, newEvent);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const getEvents = async (req: Request, res: Response) => {
  const validationRequest = req as ValidationRequest;
  try {
    const user = validationRequest.user_data;
    if (!user || !user.scopes || user.scopes.length === 0) {
      return sendError(res, HTTP_STATUS.FORBIDDEN, HTTP_MESSAGE.FORBIDDEN);
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Event.findAndCountAll({
      include: [
        { model: EventSeries, as: 'series' },
        user.scopes[0].scoped_entity_type === SCOPE_TYPE.DESA
          ? { model: DesaModel, as: 'desa' }
          : { model: KelompokModel, as: 'kelompok' },
      ],
      limit: Number(limit),
      offset,
      order: [['event_date', 'DESC']],
    });

    res.status(HTTP_STATUS.OK).json({
      data: rows,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / Number(limit)),
        currentPage: page,
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

export const getEventDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    }

    res.status(HTTP_STATUS.OK).json(event);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);
    if (!event)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);

    await event.destroy();
    sendSuccess(res, 'Event deleted successfully');
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
