import { UserModel, DesaModel, KelompokModel } from '../models';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/db';
import { sendError, sendSuccess } from '../utils/commons';

type UserBody = {
  name: string;
  username: string;
  password: string;
  desaIds: Array<number>;
  kelompokIds: Array<number>;
};

export const getList = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;
  const search = (req.query.search as string)?.trim();

  const whereClause = search
    ? {
        [Op.or]: [
          { username: { [Op.like]: `%${search}%` } },
          { name: { [Op.like]: `%${search}%` } },
        ],
      }
    : undefined;

  try {
    const { count, rows } = await UserModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'username', 'name', 'is_active', 'created_at'],
      include: [
        {
          model: DesaModel,
          as: 'Desas',
          attributes: ['id', 'name'],
          through: { attributes: [] }, // jangan tampilkan tabel pivot
        },
        {
          model: KelompokModel,
          as: 'Kelompoks',
          attributes: ['id', 'name'],
          through: { attributes: [] },
        },
      ],
      distinct: true, // untuk menghitung jumlah unik
    });

    const data = rows.map((user) => {
      const plain = user.get({ plain: true }) as any;
      return {
        id: plain.id,
        username: plain.username,
        name: plain.name,
        is_active: plain.is_active,
        desas: plain.Desas || [],
        kelompoks: plain.Kelompoks || [],
      };
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      data,
      pagination: {
        total: count,
        totalPages,
        currentPage: page,
      },
    });
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const getById = async (req: Request<{ id: string }>, res: Response) => {
  const user = await UserModel.findOne({
    where: { id: req.params.id },
  });

  if (!user) {
    return sendError(res, 400, 'User not exists');
  }

  try {
    const response = await UserModel.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'username', 'name', 'is_active'],
    });
    res.status(200).json(response);
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const createData = async (
  req: Request<{}, {}, UserBody>,
  res: Response
) => {
  const t = await sequelize.transaction();
  const { name, username, password, desaIds, kelompokIds } = req.body;
  if (!desaIds || desaIds.length === 0) {
    return sendError(res, 400, 'DESA IS REQUIRED');
  }

  if (!kelompokIds || kelompokIds.length === 0) {
    return sendError(res, 400, 'KELOMPOK IS REQUIRED');
  }
  try {
    const existingUser = await UserModel.findOne({ where: { username } });
    if (existingUser) {
      return sendError(res, 400, 'Username already exists');
    }
    const hashPassword = await argon2.hash(password);
    const user = await UserModel.create({
      name,
      username,
      password: hashPassword,
      is_active: true,
    });

    // 3. Mapping desa (jika ada)
    if (desaIds && Array.isArray(desaIds) && desaIds.length > 0) {
      const desas = await DesaModel.findAll({ where: { id: desaIds } });
      await (user as any).addDesas(desas, { transaction: t }); // ADD (tidak overwrite)
    }

    // 4. Mapping kelompok (jika ada)
    if (kelompokIds && Array.isArray(kelompokIds) && kelompokIds.length > 0) {
      const kelompoks = await KelompokModel.findAll({
        where: { id: kelompokIds },
      });
      await (user as any).addKelompoks(kelompoks, { transaction: t });
    }

    await t.commit();

    res.status(201).json({ message: 'Registered!' });
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const updateData = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    where: { id: req.params.id },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, is_active, kelompokIds, desaIds } = req.body;

  if (!desaIds || desaIds.length === 0) {
    return res.status(400).json({ message: 'DESA IS REQUIRED' });
  }

  if (!kelompokIds || kelompokIds.length === 0) {
    return res.status(400).json({ message: 'KELOMPOK IS REQUIRED' });
  }

  let hashPassword;
  if (password === '' || password === null || !password) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  try {
    UserModel.update(
      {
        is_active,
      },
      {
        where: {
          id: user.id,
        },
      }
    );

    if (Array.isArray(desaIds)) {
      await (user as any).setDesas(desaIds); // ini akan hapus mapping lama dan isi baru
    }

    // Update mapping kelompok (replace lama)
    if (Array.isArray(kelompokIds)) {
      await (user as any).setKelompoks(kelompokIds);
    }

    res.status(200).json({ message: 'User success updated!' });
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const deleteData = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    where: { id: req.params.id },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  try {
    UserModel.destroy({
      where: {
        id: user.id,
      },
    });

    res.status(200).json({ message: 'User success deleted!' });
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};
