import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Users, { UserAttributes } from '../models/User';
import { Op } from 'sequelize';
import { HTTP_MESSAGE, HTTP_STATUS } from '../utils/constants';

interface ValidationRequest extends Request {
  user_data: UserAttributes;
}

export const accessValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationRequest = req as ValidationRequest;
  const { authorization } = validationRequest.headers;

  if (!authorization) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: 'Missing token' });
  }

  const token = authorization.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET!;

  try {
    const jwt_decode = jwt.verify(token, JWT_SECRET);

    if (typeof jwt_decode !== 'string') {
      const response = await Users.findOne({
        where: { id: jwt_decode.id },
        attributes: ['id'],
      });
      if (!response) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: 'Unauthorized, User not found',
        });
      }
      validationRequest.user_data = jwt_decode as UserAttributes;
    }
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: 'Unauthorized, Invalid token',
      error: err,
    });
  }

  next();
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationRequest = req as ValidationRequest;
    if (!validationRequest.user_data)
      return res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: 'Unauthorized' });

    const userRoles =
      validationRequest.user_data.roles?.map((r: any) => r.role_name) || [];

    const hasRole = userRoles.some((role: string) =>
      allowedRoles.includes(role)
    );
    if (!hasRole) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: HTTP_MESSAGE.FORBIDDEN });
    }

    next();
  };
};

export const scopeFilterMiddleware = (
  entity: 'student' | 'desa' | 'kelompok'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user_data;
      if (!user || !user.scopes) {
        (req as any).scopeFilter = {}; // no scope
        return next();
      }

      const scopes = user.scopes;
      const filter: any = {};

      // 🧠 Logic tergantung entity yang diakses
      if (entity === 'student') {
        const desaScopes = scopes.filter((s: any) => s.type === 'DESA');
        const kelompokScopes = scopes.filter((s: any) => s.type === 'KELOMPOK');

        if (desaScopes.length > 0) {
          filter['$kelompok.desa_id$'] = {
            [Op.in]: desaScopes.map((s: any) => s.desa.id),
          };
        }

        if (kelompokScopes.length > 0) {
          filter['kelompok_id'] = {
            [Op.in]: kelompokScopes.map((s: any) => s.kelompok.id),
          };
        }
      }

      if (entity === 'desa') {
        const desaScopes = scopes.filter((s: any) => s.type === 'DESA');
        if (desaScopes.length > 0) {
          filter.id = {
            [Op.in]: desaScopes.map((s: any) => s.desa.id),
          };
        }
      }

      if (entity === 'kelompok') {
        const kelompokScopes = scopes.filter((s: any) => s.type === 'KELOMPOK');
        if (kelompokScopes.length > 0) {
          filter.id = {
            [Op.in]: kelompokScopes.map((s: any) => s.kelompok.id),
          };
        }
      }

      // simpan filter agar bisa dipakai di controller
      (req as any).scopeFilter = filter;
      next();
    } catch (error) {
      console.error('Scope middleware error:', error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: HTTP_MESSAGE.INTERNAL_SERVER_ERROR });
    }
  };
};
