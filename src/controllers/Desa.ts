import { Request, Response } from 'express';
import { DesaModel } from '../models/index';
import { sendError, sendSuccess } from '../utils/commons';

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

    res.status(200).json({
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

export const getDesaById = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });
    res.json(desa);
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const createDesa = async (
  req: Request<{}, {}, DesaBody>,
  res: Response
) => {
  try {
    const { name, address } = req.body;
    if (!name || !address) {
      return sendError(res, 400, 'BAD REQUEST');
    }

    const existingDesa = await DesaModel.findOne({ where: { name } });
    if (existingDesa) {
      return sendError(res, 400, 'Nama Desa sudah digunakan');
    }

    await DesaModel.create({ name, address });
    res.status(201).json({ message: 'Desa berhasil dibuat' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const updateDesa = async (req: Request, res: Response) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  const existingDesa = await DesaModel.findOne({ where: { name } });
  if (existingDesa) {
    return sendError(res, 400, 'Nama Desa sudah digunakan');
  }
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });

    await desa.update({ name: req.body.name });
    res.status(200).json({ message: 'Desa berhasil diperbarui' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const deleteDesa = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });

    await desa.destroy();
    res.status(200).json({ message: 'Desa berhasil dihapus' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};
