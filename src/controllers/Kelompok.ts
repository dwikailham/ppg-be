import { Request, Response } from 'express';
import { KelompokModel, DesaModel } from '../models/index';
import { sendError } from '../utils/commons';

type KelompokBody = { name: string; desa_id: number; address: string };

export const getAllKelompok = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await KelompokModel.findAndCountAll({
      include: [{ model: DesaModel, attributes: ['id', 'name'] }],
      limit,
      offset,
      attributes: { exclude: ['created_at', 'updated_at', 'desa_id'] },
      order: [['created_at', 'DESC']],
    });

    const result = rows.map((kelompok) => ({
      id: kelompok.id,
      name: kelompok.name,
      address: kelompok.address,
      desa: kelompok.Desa
        ? { id: kelompok.Desa.id, name: kelompok.Desa.name }
        : null,
    }));

    res.status(200).json({
      data: result,
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

export const getKelompokById = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id, {
      include: [{ model: DesaModel, attributes: ['id', 'name'] }],
    });
    if (!kelompok) return sendError(res, 404, 'Kelompok tidak ditemukan');
    res.status(200).json(kelompok);
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const createKelompok = async (
  req: Request<{}, {}, KelompokBody>,
  res: Response
) => {
  const { name, desa_id, address } = req.body;
  if (!name || !desa_id) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return sendError(res, 400, 'Nama sudah digunakan');
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return sendError(res, 400, 'Desa Tidak Ditemukan');
  }

  try {
    await KelompokModel.create({
      desa_id,
      name,
      address,
    });
    res.status(201).json({ message: 'Kelompok berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'ITNERNAL SERVER ERROR', error });
  }
};

export const updateKelompok = async (req: Request, res: Response) => {
  const { name, desa_id, address } = req.body;
  if (!name || !desa_id) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return sendError(res, 400, 'Nama sudah digunakan');
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return sendError(res, 400, 'Desa Tidak Ditemukan');
  }
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok) return sendError(res, 404, 'Kelompok tidak ditemukan');

    await kelompok.update({
      desa_id,
      name,
      address,
    });
    res.status(200).json({ message: 'Kelompok berhasil diperbarui' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const deleteKelompok = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok) return sendError(res, 404, 'Kelompok tidak ditemukan');

    await kelompok.destroy();
    res.json({ message: 'Kelompok berhasil dihapus' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};
