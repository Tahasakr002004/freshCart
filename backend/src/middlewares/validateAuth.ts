// src/middlewares/validateAuth.ts
import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/mongodb/userModel";

type Role = "user" | "admin";

export type AuthContext = {
  role: Role;

  // user
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;

  // admin
  adminId?: number | string;
  adminName?: string;
};

export type AuthRequest = Request & {
  auth?: AuthContext;
  user?: any; // Mongo user document (needed for cart/order)
};

const validateAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const r = req as AuthRequest;

  const header =
    (req.headers["authorization"] as string | undefined) ||
    (req.headers["Authorization"] as string | undefined);

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = header.substring(7).trim();

  // 1) Try USER token
  const userSecret = process.env.JWT_SECRET;
  if (userSecret) {
    try {
      const payload = jwt.verify(token, userSecret) as JwtPayload & {
        role?: Role;
        userId?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
      };

      const role: Role = (payload.role as Role) || "user";
      if (role !== "user") throw new Error("Not a user token");

      if (!payload.email) {
        res.status(400).json({ message: "Token payload invalid (missing email)" });
        return;
      }

      const user = await userModel.findOne({ email: payload.email });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      r.user = user;
      r.auth = {
        role: "user",
        userId: payload.userId || (user._id as any).toString(),
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
      };

      next();
      return;
    } catch {
      // ignore and try admin
    }
  }

  // 2) Try ADMIN token
  const adminSecret = process.env.JWT_SECRETADMIN;
  if (adminSecret) {
    try {
      const payload = jwt.verify(token, adminSecret) as JwtPayload & {
        role?: Role;
        id?: number | string;
        adminName?: string;
      };

      const role: Role = (payload.role as Role) || "admin";
      if (role !== "admin") {
        res.status(401).json({ message: "Invalid admin token role" });
        return;
      }

      const adminName = payload.adminName || "Admin";

      r.auth = {
        role: "admin",
        adminId: payload.id,
        adminName,
      };

      // Map admin tokens to a Mongo "shopper" user so cart/checkout can reuse user-based services.
      try {
        const adminKeySource = payload.id ?? adminName;
        const adminKey = String(adminKeySource ?? "admin").replace(/[^a-zA-Z0-9_-]/g, "-");
        const adminEmail = `admin-${adminKey}@freshcart.local`;

        let adminUser = await userModel.findOne({ email: adminEmail });
        if (!adminUser) {
          adminUser = await userModel.create({
            firstName: adminName,
            lastName: "Admin",
            email: adminEmail,
            password: "",
          });
        }

        r.user = adminUser;
      } catch (err) {
        console.error("[validateAuth] failed to load admin shopper user:", err);
        res.status(500).json({ message: "Failed to initialize admin shopper profile" });
        return;
      }

      next();
      return;
    } catch {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
  }

  res.status(500).json({ message: "JWT secrets not configured" });
};

export default validateAuth;
