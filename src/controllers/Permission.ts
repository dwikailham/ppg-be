import { Request, Response } from 'express';
import { Permission } from '../models';
import { sendError } from '../utils/commons';

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Permission.findAndCountAll({
      limit,
      offset,
      attributes: {
        exclude: ['updatedAt'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const createPermission = async (req: Request, res: Response) => {
  const { permission_name } = req.body;
  try {
    if (!permission_name) {
      return sendError(res, 400, 'BAD REQUEST');
    }

    const existingData = await Permission.findOne({
      where: { permission_name },
    });
    if (existingData) {
      return sendError(res, 400, 'DATA IS ALREADY EXISTS');
    }

    await Permission.create({ permission_name });

    res.status(201).json({ message: 'Data berhasil dibuat' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};
