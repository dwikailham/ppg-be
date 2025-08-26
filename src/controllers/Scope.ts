import { Request, Response } from 'express';
import { UserScope } from '../models/UserScope';
import { Sequelize } from 'sequelize';
import { DesaModel, KelompokModel } from '../models';
import { sendError, sendSuccess } from '../utils/commons';

export const getUserScopes = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await UserScope.findAndCountAll({
      include: [
        {
          model: DesaModel,
          as: 'desa',
          required: false,
          where: Sequelize.where(
            Sequelize.col('UserScope.scoped_entity_type'),
            'DESA'
          ),
        },
        {
          model: KelompokModel,
          as: 'kelompok',
          required: false,
          where: Sequelize.where(
            Sequelize.col('UserScope.scoped_entity_type'),
            'KELOMPOK'
          ),
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
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

export const addUserScope = async (req: Request, res: Response) => {
  const { scoped_entity_type, scoped_entity_id, user_id } = req.body;

  try {
    await UserScope.create({
      user_id,
      scoped_entity_type,
      scoped_entity_id,
    });

    sendSuccess(res, 'Scope added successfully');
  } catch (error) {
    sendError(res, 500, 'INTERNAL SERVER ERROR', error);
  }
};

export const deleteUserScope = async (req: Request, res: Response) => {
  const { scopeId } = req.params;
  await UserScope.destroy({ where: { id: scopeId } });
  sendSuccess(res, 'Scope successfully deleted');
};
