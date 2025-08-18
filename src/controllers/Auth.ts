import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel, DesaModel, KelompokModel } from '../models';
import argon2 from 'argon2';
import { DesaAttributes } from '../models/Desa';
import { UserAttributes } from '../models/User';

type UserWithRelations = UserAttributes & {
  Desas?: DesaAttributes[];
  Kelompoks?: DesaAttributes[];
};

export const Login = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    where: { username: req.body.username },
    include: [
      {
        model: DesaModel,
        through: { attributes: [] }, // hide kolom pivot user_desa
      },
      {
        model: KelompokModel,
        through: { attributes: [] }, // hide kolom pivot user_kelompok
      },
    ],
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const matchPassword = await argon2.verify(user.password, req.body.password);
  if (!matchPassword) {
    return res.status(400).json({ message: 'Invalid Email or Password' });
  }
  if (!user.is_active) {
    return res.status(400).json({ message: 'User In Active' });
  }

  // Convert instance Sequelize → plain object
  const plainUser = user.get({ plain: true }) as UserWithRelations;
  const data = {
    name: user.name,
    username: user.username,
    id: user.id,
    desas: plainUser.Desas?.length ? plainUser?.Desas.map((el) => el.id) : [],
    kelompoks: plainUser.Kelompoks?.length
      ? plainUser?.Kelompoks.map((el) => el.id)
      : [],
  };

  const JWT_SECRET = process.env.JWT_SECRET!;

  const token = jwt.sign(data, JWT_SECRET);

  res.status(200).json({ user_data: data, token });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user_data?.id; // dari JWT middleware

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await UserModel.findByPk(userId, {
      attributes: { exclude: ['password', 'created_at', 'updated_at'] },
      include: [
        { model: DesaModel, through: { attributes: [] } },
        { model: KelompokModel, through: { attributes: [] } },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Convert instance Sequelize → plain object
    const plainUser = user.get({ plain: true }) as UserWithRelations;

    // Rename key menjadi snake_case
    const result = {
      ...plainUser,
      desas: plainUser.Desas?.length
        ? plainUser?.Desas.map((el) => ({ id: el.id, name: el.name }))
        : [],
      kelompoks: plainUser.Kelompoks?.length
        ? plainUser?.Kelompoks.map((el) => ({ id: el.id, name: el.name }))
        : [],
    };

    // Hapus key lama (camelCase model name)
    delete (result as any).Desas;
    delete (result as any).Kelompoks;

    res.json({
      message: 'Berhasil mengambil data user',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data user',
      error: (error as Error).message,
    });
  }
};
