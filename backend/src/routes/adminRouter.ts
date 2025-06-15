import express from "express";
import { registerAdminHandler, loginAdminHandler } from "../services/adminService";
import validateAdminJWT, { ExtendedRequestAdmin } from "../middlewares/validateAdminJWT";

const adminRouter = express.Router();

adminRouter.post("/registeradmin",
  registerAdminHandler);
adminRouter.post("/loginadmin",
  loginAdminHandler);

// admin dashboard
adminRouter.get("/dashboard", validateAdminJWT, (req:ExtendedRequestAdmin, res:any) => {
  res.json({ message: `Welcome to dashboard for  ${req.admin?.adminName}` });
});

export default adminRouter;