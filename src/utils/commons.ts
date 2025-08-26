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
  message: string = 'Success',
  data?: any
) {
  return res.status(200).json({ message, data });
}
