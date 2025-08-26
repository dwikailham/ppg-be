import { Request, Response } from 'express';
import { sendError } from '../utils/commons';
import { Role, Permission } from '../models';

export const getRoles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Role.findAndCountAll({
      limit,
      offset,
      include: [Permission],
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
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { role_name, permissionIds } = req.body;
  if (!role_name || !permissionIds.length) {
    return sendError(res, 400, 'BAD REQUEST');
  }
  try {
    // 1. buat role baru
    const role = await Role.create({ role_name });

    // 2. kalau ada permissionIds, langsung assign
    if (permissionIds && Array.isArray(permissionIds)) {
      await (role as any).addPermissions(permissionIds); // karena belongsToMany
    }

    // 3. ambil ulang data role + permission yang sudah di-assign
    // const result = await Role.findByPk(role.id, {
    //   include: [Permission],
    // });

    res.status(201).json({ message: 'Data berhasil dibuat' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating role', error });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role_name, permissionIds } = req.body;

  if (!role_name || !permissionIds.length) {
    return sendError(res, 400, 'BAD REQUEST');
  }

  try {
    // 1. cek role ada atau tidak
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
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

    // 4. ambil ulang role beserta permissionnya
    const updatedRole = await Role.findByPk(id, {
      include: [Permission],
    });

    res.status(201).json({ message: 'Data berhasil dibuat', data: updateRole });
  } catch (error) {
    res.status(500).json({ message: 'Error updating role', error });
  }
};
