import { Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS } from './constants';

export function sendError(
  res: Response,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: string = HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
  error?: any
) {
  return res.status(status).json({ message, error });
}

export function sendSuccess(
  res: Response,
  message: string = HTTP_MESSAGE.OK,
  data?: unknown
) {
  return res.status(HTTP_STATUS.OK).json({ message, data });
}
