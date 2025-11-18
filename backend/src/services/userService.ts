import userModel, { IUser } from "../models/mongodb/userModel";
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

// JWT mit minimalen User-Infos erzeugen
const generateJWT = (payload: { firstName: string; lastName: string; email: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "");
};

export const register = async ({ firstName, lastName, email, password }: RegisterData) => {
  // Gibt es den User schon?
  const existing = await userModel.findOne({ email });
  if (existing) {
    return { data: "user is already existed", statusCode: 401 };
  }

  // Passwort hashen
  const hashedPassword = await bcrypt.hash(password, 10);

  // User anlegen
  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  await newUser.save();

  const token = generateJWT({
    firstName: newUser.firstName,
    lastName: newUser.lastName,
    email: newUser.email,
  });

  return { data: token, statusCode: 200 };
};

export const login = async ({ email, password }: LoginData) => {
  // User suchen
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "user is not existed", statusCode: 401 };
  }

  // Passwort prüfen
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return { data: "password is not correct", statusCode: 401 };
  }

  const token = generateJWT({
    firstName: findUser.firstName,
    lastName: findUser.lastName,
    email: findUser.email,
  });

  return { data: token, statusCode: 200 };
};
