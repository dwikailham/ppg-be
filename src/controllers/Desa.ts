import { Request, Response } from 'express';
import { DesaModel } from '../models/index';
import { sendError, sendSuccess } from '../utils/commons';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

type DesaBody = {
  name: string;
  address: string;
};

export const getAllDesa = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await DesaModel.findAndCountAll({
      limit,
      offset,
      order: [['created_at', 'DESC']],
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

export const getDesaById = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: HTTP_MESSAGE.NOT_FOUND });
    res.json(desa);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createDesa = async (
  req: Request<{}, {}, DesaBody>,
  res: Response
) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
    }

    const existingDesa = await DesaModel.findOne({ where: { name } });
    if (existingDesa) {
      return sendError(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'Nama Desa sudah digunakan'
      );
    }

    await DesaModel.create({ name, address });
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

export const updateDesa = async (req: Request, res: Response) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  const existingDesa = await DesaModel.findOne({ where: { name } });
  if (existingDesa) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Nama Desa sudah digunakan');
  }
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: HTTP_MESSAGE.NOT_FOUND });

    await desa.update({ name: req.body.name });
    res.status(HTTP_STATUS.OK).json({ message: 'Desa berhasil diperbarui' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteDesa = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: HTTP_MESSAGE.NOT_FOUND });

    await desa.destroy();
    res.status(HTTP_STATUS.OK).json({ message: 'Desa berhasil dihapus' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
