import express from "express";
import {
    deleteUserAccount,
    getAllUsers,
    
} from "../controllers/adminuserController";
import validateAdminJWT from "../middlewares/validateAdminJWT";



export const adminuserRouter = express.Router();

adminuserRouter.get("/users", validateAdminJWT, getAllUsers);

adminuserRouter.delete("/users/:id", validateAdminJWT, deleteUserAccount);

export default adminuserRouter;