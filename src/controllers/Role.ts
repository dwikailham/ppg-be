import { Request, Response } from 'express';
import { sendError } from '../utils/commons';
import { Role, Permission } from '../models';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Role.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
          through: { attributes: [] },
        },
      ],
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
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { role_name, permissionIds } = req.body;
  if (!role_name || !permissionIds.length) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }
  try {
    // 1. buat role baru
    const role = await Role.create({ role_name });

    // 2. kalau ada permissionIds, langsung assign
    if (permissionIds && Array.isArray(permissionIds)) {
      await (role as any).addPermissions(permissionIds); // karena belongsToMany
    }

    res.status(HTTP_STATUS.CREATED).json({ message: 'Data berhasil dibuat' });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating role', error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role_name, permissionIds } = req.body;

  if (!role_name || !permissionIds.length) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  try {
    // 1. cek role ada atau tidak
    const role = await Role.findByPk(id);
    if (!role) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: HTTP_MESSAGE.NOT_FOUND });
    }

    // 2. update nama role (kalau ada)
    if (role_name) {
      role.role_name = role_name;
      await role.save();
    }

    // 3. replace permission lama dengan yang baru
    if (permissionIds && Array.isArray(permissionIds)) {
      await (role as any).setPermissions(permissionIds); // <-- sync permission
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Data berhasil dibuat' });
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};
