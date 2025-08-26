import { UserModel } from '../models';
import argon2 from 'argon2';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/db';
import { Role } from '../models/Role';
import { sendError, sendSuccess } from '../utils/commons';

type UserBody = {
  name: string;
  username: string;
  password: string;
  roleIds: Array<number>;
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
      distinct: true,
      include: [
        {
          model: Role,
          as: 'roles',
          attributes: ['id', 'role_name'],
          through: { attributes: [] },
        },
      ],
    });

    const totalPages = Math.ceil(count / limit);
    res.status(200).json({
      data: rows,
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
  const userId = parseInt(req.params.id, 0);
  const users = await UserModel.findOne({
    where: { id: userId },
    attributes: ['id', 'username', 'name', 'is_active'],
    include: [
      {
        model: Role,
        as: 'roles',
        attributes: ['id', 'role_name'],
        through: { attributes: [] },
      },
    ],
  });

  if (!users) {
    return sendError(res, 400, 'User not exists');
  }

  try {
    sendSuccess(res, users, 'Success get user data');
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const createData = async (
  req: Request<{}, {}, UserBody>,
  res: Response
) => {
  const t = await sequelize.transaction();
  const { name, username, password, roleIds } = req.body;

  if (!name || !username || !roleIds || roleIds?.length === 0) {
    return sendError(res, 400, 'BAD REQUEST');
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

    if (roleIds && roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: roleIds } });
      await (user as any).addRoles(roles, { transaction: t });
    }

    await t.commit();

    res.status(201).json({ message: 'Registered!' });
  } catch (err: any) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', err);
  }
};

export const updateData = async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.id, 0);
  if (isNaN(user_id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  const user = await UserModel.findOne({
    where: { id: user_id },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { password, is_active, roleIds } = req.body;

  if (!roleIds || roleIds?.length === 0) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  let hashPassword;
  if (password === '' || password === null || !password) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }

  const t = await sequelize.transaction();

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
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: roleIds } });
      await (user as any).setRoles(roles, { transaction: t });
    }

    await t.commit();

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
