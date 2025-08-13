import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models';
import argon2 from 'argon2';

export const Login = async (req: Request, res: Response) => {
  const user = await UserModel.findOne({
    where: { username: req.body.username },
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
  const data = {
    name: user.name,
    username: user.username,
    id: user.id,
  };
  const JWT_SECRET = process.env.JWT_SECRET!;

  const token = jwt.sign(data, JWT_SECRET);

  res.status(200).json({ user_data: data, token });
};
