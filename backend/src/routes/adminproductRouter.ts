//Routing handling
import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/adminproductController";
import validateAdminJWT from "../middlewares/validateAdminJWT";

const adminproductRouter = express.Router();

adminproductRouter.get("/products", validateAdminJWT, getAllProducts);
adminproductRouter.post("/products/item", validateAdminJWT, createProduct);
adminproductRouter.put("/products/:id", validateAdminJWT, updateProduct);
adminproductRouter.delete("/products/:id", validateAdminJWT, deleteProduct);

export default adminproductRouter;