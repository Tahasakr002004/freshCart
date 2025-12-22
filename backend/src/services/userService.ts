import userModel from "../models/mongodb/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ServiceResult<T = any> {
  statusCode: number;
  data: T;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret || !secret.trim()) {
    throw new Error("JWT_SECRET not configured");
  }
  return secret;
};

// ✅ role + userId in token
const generateJWT = (payload: {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user";
}): string => {
  const secret = getJwtSecret();
  return jwt.sign(payload, secret, { expiresIn: "2h" });
};

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterData): Promise<ServiceResult<string>> => {
  try {
    const existing = await userModel.findOne({ email });

    if (existing) {
      return { statusCode: 409, data: "user is already existed" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    const token = generateJWT({
      userId: (newUser._id as any).toString(),
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: "user",
    });

    return { statusCode: 200, data: token };
  } catch (err) {
    console.error("[userService.register] error:", err);
    return { statusCode: 500, data: "Internal server error" };
  }
};

export const login = async ({ email, password }: LoginData): Promise<ServiceResult<string>> => {
  try {
    const findUser = await userModel.findOne({ email });

    if (!findUser) {
      return { statusCode: 401, data: "user is not existed" };
    }

    const passwordMatch = await bcrypt.compare(password, findUser.password);

    if (!passwordMatch) {
      return { statusCode: 401, data: "password is not correct" };
    }

    const token = generateJWT({
      userId: (findUser._id as any).toString(),
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      email: findUser.email,
      role: "user",
    });

    return { statusCode: 200, data: token };
  } catch (err) {
    console.error("[userService.login] error:", err);
    return { statusCode: 500, data: "Internal server error" };
  }
};
