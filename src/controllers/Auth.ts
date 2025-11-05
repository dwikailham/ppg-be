import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  UserModel,
  Role,
  UserScope,
  DesaModel,
  KelompokModel,
} from '../models';
import argon2 from 'argon2';
import { UserAttributes } from '../models/User';
import { sendError } from '../utils/commons';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

type UserWithRelations = UserAttributes & {
  scopes: Array<any>;
};

export const Login = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({
      where: { username: req.body.username },
      attributes: ['id', 'username', 'name', 'is_active', 'password'],
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'role_name'],
          through: { attributes: [] },
        },
        {
          model: UserScope,
          as: 'scopes',
          attributes: ['id', 'scoped_entity_type', 'scoped_entity_id'],
          include: [
            { model: DesaModel, as: 'desa', attributes: ['id', 'name'] },
            {
              model: KelompokModel,
              as: 'kelompok',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'User not found' });
    }

    const matchPassword = await argon2.verify(user.password, req.body.password);
    if (!matchPassword) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'Invalid Email or Password' });
    }
    if (!user.is_active) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: 'User In Active' });
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    const plainUser = user.get({ plain: true }) as UserWithRelations;
    delete (plainUser as any).password;
    const formattedScopes = plainUser.scopes.map((s) => {
      if (s.scoped_entity_type === 'DESA') {
        return {
          id: s.id,
          type: s.scoped_entity_type,
          desa: s.desa,
          kelompok: null,
        };
      }
      if (s.scoped_entity_type === 'KELOMPOK') {
        return {
          id: s.id,
          type: s.scoped_entity_type,
          desa: null,
          kelompok: s.kelompok,
        };
      }
      return s;
    });

    plainUser.scopes = formattedScopes;

    const token = jwt.sign(plainUser, JWT_SECRET);

    res.status(HTTP_STATUS.OK).json({ user_data: plainUser, token });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user_data?.id; // dari JWT middleware

    if (!userId) {
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });
    }

    const user = await UserModel.findByPk(userId, {
      attributes: { exclude: ['password', 'created_at', 'updated_at'] },
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'role_name'],
          through: { attributes: [] },
        },
      ],
    });

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: 'User tidak ditemukan' });
    }

    const plainUser = user.get({ plain: true }) as UserWithRelations;

    res.status(HTTP_STATUS.OK).json({
      data: plainUser,
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
