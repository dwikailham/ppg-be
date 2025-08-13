import { Request, Response } from 'express';
import { DesaModel } from '../models/index';

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

export const getDesaById = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });
    res.json(desa);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const createDesa = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.create({ name: req.body.name });
    res.status(201).json(desa);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const updateDesa = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });

    await desa.update({ name: req.body.name });
    res.json(desa);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const deleteDesa = async (req: Request, res: Response) => {
  try {
    const desa = await DesaModel.findByPk(req.params.id);
    if (!desa) return res.status(404).json({ message: 'Desa tidak ditemukan' });

    await desa.destroy();
    res.json({ message: 'Desa berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};
