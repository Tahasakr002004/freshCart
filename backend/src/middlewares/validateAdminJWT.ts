import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


const JWT_SECRETADMIN = process.env.JWT_SECRETADMIN || "F&PHB*Zn)CY&R:-qaH&g3KGOl!`i2f8!hGl/g?pwOFwYJ]'S41Nnmf>$.~^vDu9";

interface JwtPayload {
  id: number | string;
  adminName: string;
}

// Extend Express's Request object
export interface ExtendedRequestAdmin extends Request {
  admin?: JwtPayload;
}

const validateAdminJWT = (req: ExtendedRequestAdmin, res: any, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(403).json({ message: "Authorization token missing or malformed." });
  }

  const token = authHeader.split(" ")[1]?.trim();

  try {
    const decoded = jwt.verify(token, JWT_SECRETADMIN) as JwtPayload;
    req.admin = decoded as JwtPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token." });
  }
};

export default validateAdminJWT;
