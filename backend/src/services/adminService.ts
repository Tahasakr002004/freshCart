
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "../models/postgresql/adminModel";
import { ExtendedRequestAdmin } from "../middlewares/validateAdminJWT";
import dotenv from 'dotenv';

dotenv.config();



 const JWT_SECRETADMIN = process.env.JWT_SECRETADMIN || "F&PHB*Zn)CY&R:-qaH&g3KGOl!`i2f8!hGl/g?pwOFwYJ]'S41Nnmf>$.~^vDu9";


// Register Admin
export const registerAdminHandler = async (req: ExtendedRequestAdmin, res: any) => {
  const { adminName, adminPassword } = req.body;

  if (!adminName || !adminPassword) {
    return res.status(400).json({ message: "Admin name and password are required." });
  }

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ where: { adminName } });
  if (existingAdmin) {
    return res.status(409).json({ message: "Admin already exists." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin
  const newAdmin = await Admin.create({ adminName, adminPassword: hashedPassword });

  // Generate JWT
  const token = jwt.sign({ id: newAdmin.id, adminName: newAdmin.adminName },JWT_SECRETADMIN);

  return res.status(201).json({
    message: "Admin registered successfully",
    admin: { id: newAdmin.id, adminName: newAdmin.adminName },
    token
  });
};

// Login Admin
export const loginAdminHandler = async (req: ExtendedRequestAdmin, res: any) => {
  const { adminName, adminPassword } = req.body;

  if (!adminName || !adminPassword) {
    return res.status(400).json({ message: "Admin name and password are required." });
  }

  const admin = await Admin.findOne({ where: { adminName } });
  if (!admin) {
    return res.status(401).json({ message: "Invalid admin name or password." });
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(adminPassword, admin.adminPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid admin name or password." });
  }

  // Generate JWT
  const token = jwt.sign({ id: admin.id, adminName: admin.adminName }, JWT_SECRETADMIN);

  return res.status(200).json({ token });
};
