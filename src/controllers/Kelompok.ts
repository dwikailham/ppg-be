import { Request, Response } from 'express';
import { KelompokModel, DesaModel } from '../models/index';
import { sendError } from '../utils/commons';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

type KelompokBody = { name: string; desa_id: number; address: string };

export const getAllKelompok = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await KelompokModel.findAndCountAll({
      include: [{ model: DesaModel, attributes: ['id', 'name'], as: 'desa' }],
      limit,
      offset,
      attributes: { exclude: ['created_at', 'updated_at', 'desa_id'] },
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

export const getKelompokById = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id, {
      include: [{ model: DesaModel, attributes: ['id', 'name'] }],
    });
    if (!kelompok)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    res.status(HTTP_STATUS.OK).json(kelompok);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createKelompok = async (
  req: Request<{}, {}, KelompokBody>,
  res: Response
) => {
  const { name, desa_id, address } = req.body;
  if (!name || !desa_id) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Nama sudah digunakan');
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Desa Tidak Ditemukan');
  }

  try {
    await KelompokModel.create({
      desa_id,
      name,
      address,
    });
    res.status(201).json({ message: 'Kelompok berhasil dibuat' });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR, error });
  }
};

export const updateKelompok = async (req: Request, res: Response) => {
  const { name, desa_id, address } = req.body;
  if (!name || !desa_id) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Nama sudah digunakan');
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Desa Tidak Ditemukan');
  }
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);

    await kelompok.update({
      desa_id,
      name,
      address,
    });
    res
      .status(HTTP_STATUS.OK)
      .json({ message: 'Kelompok berhasil diperbarui' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteKelompok = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);

    await kelompok.destroy();
    res.json({ message: 'Kelompok berhasil dihapus' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
