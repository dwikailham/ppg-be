import { Request, Response } from 'express';
import { StudentModel, KelompokModel, DesaModel } from '../models/index';
import { sendError } from '../utils/commons';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

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

    const whereCondition = (req as any).scopeFilter || {};

    const { count, rows } = await StudentModel.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: KelompokModel,
          as: 'kelompok',
          attributes: ['id', 'name'],
          include: [
            {
              model: DesaModel,
              as: 'desa',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      subQuery: false,
      limit,
      offset,
      attributes: { exclude: ['created_at', 'updated_at', 'kelompok_id'] },
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

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id, {
      include: [
        {
          model: KelompokModel,
          attributes: ['id', 'name'],
          as: 'kelompok',
          include: [
            { model: DesaModel, attributes: ['id', 'name'], as: 'desa' },
          ],
        },
      ],
    });
    if (!student)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);
    res.json(student);
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createStudent = async (
  req: Request<{}, {}, StudentBody>,
  res: Response
) => {
  const { address, birth_date, gender, kelompok_id, name, phone } = req.body;
  if (!name || !kelompok_id) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  const existingKelompok = await KelompokModel.findByPk(kelompok_id);
  if (!existingKelompok) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Kelompok tidak ditemukan');
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

export const updateStudent = async (req: Request, res: Response) => {
  const { address, birth_date, gender, kelompok_id, name, phone } = req.body;
  if (!name || !kelompok_id) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  const existingKelompok = await KelompokModel.findByPk(kelompok_id);
  if (!existingKelompok) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, 'Kelompok tidak ditemukan');
  }

  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student)
      return sendError(res, HTTP_STATUS.NOT_FOUND, 'Student tidak ditemukan');

    await student.update({
      address,
      birth_date,
      gender,
      kelompok_id,
      name,
      phone,
    });
    res.status(HTTP_STATUS.OK).json({ message: 'Student berhasil diperbarui' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const student = await StudentModel.findByPk(req.params.id);
    if (!student)
      return sendError(res, HTTP_STATUS.NOT_FOUND, HTTP_MESSAGE.NOT_FOUND);

    await student.destroy();
    res.status(HTTP_STATUS.OK).json({ message: 'Student berhasil dihapus' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
