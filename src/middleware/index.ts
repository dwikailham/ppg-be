import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import Users, { UserAttributes } from '../models/User';

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
    return res.status(401).json({ message: 'Missing token' });
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
        return res.status(401).json({
          message: 'Unauthorized, User not found',
        });
      }
      validationRequest.user_data = jwt_decode as UserAttributes;
    }
  } catch (err) {
    return res.status(401).json({
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
      return res.status(401).json({ message: 'Unauthorized' });

    const userRoles =
      validationRequest.user_data.roles?.map((r: any) => r.role_name) || [];

    const hasRole = userRoles.some((role: string) =>
      allowedRoles.includes(role)
    );
    if (!hasRole) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
  };
};
