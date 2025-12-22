// src/middlewares/requireUser.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthRequest } from "./validateAuth";

const requireUser: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const r = req as AuthRequest;

  if (!r.auth || r.auth.role !== "user" || !r.user) {
    res.status(403).json({ message: "User access only" });
    return;
  }

  next();
};

export default requireUser;
