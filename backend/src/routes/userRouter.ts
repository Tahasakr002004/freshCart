import express, { Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { register, login } from '../services/userService';
import userModel from '../models/mongodb/userModel';

type TokenPayload = JwtPayload & {
  firstName?: string;
  lastName?: string;
  email?: string;
};

const userRouter = express.Router();

// einfache Test-Route
userRouter.get('/', (req: Request, res: Response): void => {
  try {
    res.send('User route is working!');
  } catch (error) {
    res.status(500).send({ message: 'Error fetching user route' });
  }
});

// Registrierung
userRouter.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { statusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(statusCode).send(data);
  } catch (error) {
    console.error('Error in /user/register:', error);
    res.status(500).send({ message: 'Error registering user' });
  }
});

// Login
userRouter.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { statusCode, data } = await login({ email, password });
    res.status(statusCode).send(data);
  } catch (error) {
    console.error('Error in /user/login:', error);
    res.status(500).send({ message: 'Error logging in user' });
  }
});

// 🔐 Token prüfen: existiert der User zu diesem Token noch?
userRouter.get('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const header =
      (req.headers['authorization'] as string | undefined) ||
      (req.headers['Authorization'] as string | undefined);

    if (!header || !header.startsWith('Bearer ')) {
      res.status(401).send({ data: 'No token provided' });
      return;
    }

    const token = header.substring(7);
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).send({ data: 'JWT secret not configured' });
      return;
    }

    const payload = jwt.verify(token, secret) as TokenPayload;

    if (!payload.email) {
      res.status(400).send({ data: 'Token payload invalid' });
      return;
    }

    const user = await userModel.findOne({ email: payload.email });

    if (!user) {
      res.status(404).send({ data: 'user not found' });
      return;
    }

    res.status(200).send({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).send({ data: 'Invalid token' });
  }
});

export default userRouter;
