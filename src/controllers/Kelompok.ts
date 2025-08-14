import { Request, Response } from 'express';
import { KelompokModel, DesaModel } from '../models/index';

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
      order: [['created_at', 'DESC']],
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
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const getKelompokById = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id, {
      include: [{ model: DesaModel, attributes: ['id', 'name'] }],
    });
    if (!kelompok)
      return res.status(404).json({ message: 'Kelompok tidak ditemukan' });
    res.json(kelompok);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const createKelompok = async (
  req: Request<{}, {}, KelompokBody>,
  res: Response
) => {
  const { name, desa_id, address } = req.body;
  if (!name || !desa_id) {
    return res.status(400).json({ message: 'BAD REQUEST' });
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return res.status(400).json({ message: 'Nama kelompok sudah digunakan' });
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return res.status(400).json({ message: 'Desa tidak ditemukan' });
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
    return res.status(400).json({ message: 'BAD REQUEST' });
  }

  const existingKelompok = await KelompokModel.findOne({ where: { name } });
  if (existingKelompok) {
    return res.status(400).json({ message: 'Nama kelompok sudah digunakan' });
  }

  const desa = await DesaModel.findByPk(desa_id);
  if (!desa) {
    return res.status(400).json({ message: 'Desa tidak ditemukan' });
  }
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok)
      return res.status(404).json({ message: 'Kelompok tidak ditemukan' });

    await kelompok.update({
      desa_id,
      name,
      address,
    });
    res.status(200).json({ message: 'Kelompok berhasil diperbarui' });
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const deleteKelompok = async (req: Request, res: Response) => {
  try {
    const kelompok = await KelompokModel.findByPk(req.params.id);
    if (!kelompok)
      return res.status(404).json({ message: 'Kelompok tidak ditemukan' });

    await kelompok.destroy();
    res.json({ message: 'Kelompok berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};
