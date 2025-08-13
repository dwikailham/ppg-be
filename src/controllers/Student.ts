import { Request, Response } from 'express';
import { StudentModel, KelompokModel, DesaModel } from '../models/index';

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // default halaman 1
    const limit = parseInt(req.query.limit as string) || 10; // default 10 data
    const offset = (page - 1) * limit;

    const { count, rows } = await StudentModel.findAndCountAll({
      include: [
        {
          model: KelompokModel,
          attributes: ['id', 'name'],
          include: [{ model: DesaModel, attributes: ['id', 'name'] }],
        },
      ],
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

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id, {
      include: [
        {
          model: KelompokModel,
          attributes: ['id', 'name'],
          include: [{ model: DesaModel, attributes: ['id', 'name'] }],
        },
      ],
    });
    if (!student)
      return res.status(404).json({ message: 'Student tidak ditemukan' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const createStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.create({
      kelompok_id: req.body.kelompok_id,
      name: req.body.name,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      phone: req.body.phone,
      address: req.body.address,
      join_date: req.body.join_date,
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student tidak ditemukan' });

    await student.update({
      kelompok_id: req.body.kelompok_id,
      name: req.body.name,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      phone: req.body.phone,
      address: req.body.address,
      join_date: req.body.join_date,
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student)
      return res.status(404).json({ message: 'Student tidak ditemukan' });

    await student.destroy();
    res.json({ message: 'Student berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'INTERNAL SERVER ERROR', error });
  }
};
