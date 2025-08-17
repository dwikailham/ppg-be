import { Response } from 'express';

export function sendError(
  res: Response,
  status: number = 500,
  message: string = 'INTERNAL SERVER ERROR',
  error?: any
) {
  return res.status(status).json({ message, error });
}

export function sendSuccess(
  res: Response,
  data?: any,
  message: string = 'Success'
) {
  return res.status(200).json({ message, data });
}
