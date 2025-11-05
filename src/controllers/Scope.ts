import { Request, Response } from 'express';
import { UserScope } from '../models/UserScope';
import { Sequelize } from 'sequelize';
import { DesaModel, KelompokModel } from '../models';
import { sendError, sendSuccess } from '../utils/commons';
import {
  HTTP_MESSAGE,
  HTTP_STATUS,
  SCOPE_TYPE,
  ScopeType,
} from '../utils/constants';

interface BodyPayload {
  user_id: number;
  scoped_entity_type: ScopeType;
  scoped_entity_id: number;
}

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
            SCOPE_TYPE.DESA
          ),
        },
        {
          model: KelompokModel,
          as: 'kelompok',
          required: false,
          where: Sequelize.where(
            Sequelize.col('UserScope.scoped_entity_type'),
            SCOPE_TYPE.KELOMPOK
          ),
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
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

export const addUserScope = async (
  req: Request<{}, {}, BodyPayload>,
  res: Response
) => {
  const { scoped_entity_type, scoped_entity_id, user_id } = req.body;

  if (!scoped_entity_id || !scoped_entity_type || !user_id) {
    return sendError(res, HTTP_STATUS.BAD_REQUEST, HTTP_MESSAGE.BAD_REQUEST);
  }

  try {
    await UserScope.create({
      user_id,
      scoped_entity_type,
      scoped_entity_id,
    });

    sendSuccess(res, 'Scope added successfully');
  } catch (error) {
    sendError(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      HTTP_MESSAGE.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

export const deleteUserScope = async (req: Request, res: Response) => {
  const { scopeId } = req.params;
  await UserScope.destroy({ where: { id: scopeId } });
  sendSuccess(res, 'Scope successfully deleted');
};
