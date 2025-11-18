// src/middlewares/validateJWT.ts
import { RequestHandler, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userModel from '../models/mongodb/userModel';
import { ExtendedRequest } from '../types/extendedRequest';

type TokenPayload = JwtPayload & {
  email?: string;
};

const validateJWT: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const header =
      (req.headers['authorization'] as string | undefined) ||
      (req.headers['Authorization'] as string | undefined);

    if (!header || !header.startsWith('Bearer ')) {
      (res as Response).status(401).send({ message: 'No token provided' });
      return;
    }

    const token = header.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      (res as Response).status(500).send({ message: 'JWT secret not configured' });
      return;
    }

    const payload = jwt.verify(token, secret) as TokenPayload;

    if (!payload.email) {
      (res as Response).status(400).send({ message: 'Token payload invalid' });
      return;
    }

    const user = await userModel.findOne({ email: payload.email });

    if (!user) {
      (res as Response).status(404).send({ message: 'User not found' });
      return;
    }

    // User ins Request-Objekt hängen
    (req as ExtendedRequest).user = user;

    next();
  } catch (error) {
    console.error('Error in validateJWT:', error);
    (res as Response).status(401).send({ message: 'Invalid token' });
  }
};

export default validateJWT;
