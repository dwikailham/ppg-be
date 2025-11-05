import { Request, Response } from 'express';
import { Permission } from '../models';
import { sendError } from '../utils/commons';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

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

    res.status(HTTP_STATUS.OK).json({
      data: rows,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
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

export const createPermission = async (req: Request, res: Response) => {
  const { permission_name } = req.body;
  try {
    if (!permission_name) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
    }

    const existingData = await Permission.findOne({
      where: { permission_name },
    });
    if (existingData) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, 'DATA IS ALREADY EXISTS');
    }

    await Permission.create({ permission_name });

    res.status(HTTP_STATUS.CREATED).json({ message: HTTP_MESSAGE.CREATED });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
