import { Request, Response } from 'express';
import { StudentModel, KelompokModel, DesaModel } from '../models/index';
import { sendError } from '../utils/commons';

type StudentBody = {
  name: string;
  kelompok_id: number;
  gender: string;
  birth_date: string;
  phone: string;
  address: string;
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1; // default halaman 1
    const limit = parseInt(req.query.limit as string) || 10; // default 10 data
    const offset = (page - 1) * limit;

    const { desas, kelompoks } = (req as any).user_data;

    const { count, rows } = await StudentModel.findAndCountAll({
      include: [
        {
          model: KelompokModel,
          attributes: ['id', 'name'],
          where: { id: kelompoks },
          include: [
            {
              model: DesaModel,
              attributes: ['id', 'name'],
              where: { id: desas },
            },
          ],
        },
      ],
      limit,
      offset,
      attributes: { exclude: ['created_at', 'updated_at', 'kelompok_id'] },
      order: [['created_at', 'DESC']],
    });

    const result = rows.map((el) => ({
      id: el.id,
      name: el.name,
      address: el.address,
      gender: el.gender,
      birth_date: el.birth_date,
      phone: el.phone,
      desa: el?.Kelompok ? el.Kelompok.Desa : null,
      kelompok: el?.Kelompok
        ? { id: el.Kelompok.id, name: el.Kelompok.name }
        : null,
    }));

    res.json({
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
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const createStudent = async (
  req: Request<{}, {}, StudentBody>,
  res: Response
) => {
  const { address, birth_date, gender, kelompok_id, name, phone } = req.body;
  if (!name || !kelompok_id) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  const existingKelompok = await KelompokModel.findByPk(kelompok_id);
  if (!existingKelompok) {
    return sendError(res, 400, 'Kelompok tidak ditemukan');
  }

  try {
    await StudentModel.create({
      address,
      birth_date,
      gender,
      kelompok_id,
      name,
      phone,
    });
    res.status(201).json({ message: 'Student berhasil dibuat' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const { address, birth_date, gender, kelompok_id, name, phone } = req.body;
  if (!name || !kelompok_id) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  const existingKelompok = await KelompokModel.findByPk(kelompok_id);
  if (!existingKelompok) {
    return sendError(res, 400, 'Kelompok tidak ditemukan');
  }

  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student) return sendError(res, 404, 'Student tidak ditemukan');

    await student.update({
      address,
      birth_date,
      gender,
      kelompok_id,
      name,
      phone,
    });
    res.status(200).json({ message: 'Student berhasil diperbarui' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student) return sendError(res, 404, 'Student tidak ditemukan');

    await student.destroy();
    res.json({ message: 'Student berhasil dihapus' });
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};
