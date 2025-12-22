import express, { Request, Response } from "express";
import validateAuth, { AuthRequest } from "../middlewares/validateAuth";

const authRouter = express.Router();

/**
 * GET /auth/me
 * Returns who is logged in (user/admin) based on the Bearer token.
 */
authRouter.get("/me", validateAuth, (req: Request, res: Response): void => {
  const r = req as AuthRequest;

  res.status(200).json({
    role: r.auth?.role ?? null,
    auth: r.auth ?? null,
    user: r.user
      ? {
          id: (r.user as any)._id?.toString?.() ?? (r.user as any).id,
          firstName: r.user.firstName,
          lastName: r.user.lastName,
          email: r.user.email,
        }
      : null,
  });
});

export default authRouter;
