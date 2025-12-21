//Routing handling
import express from "express";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts
} from "../controllers/adminproductController";
import validateAdminJWT from "../middlewares/validateAdminJWT";

import fs from "fs";
import path from "path";

const adminproductRouter = express.Router();


const imagesDir = path.join(process.cwd(), "public", "freshcartImages");

//  list available product images for admin ---
adminproductRouter.get(
  "/product-images",
  validateAdminJWT,
  async (req, res) => {
    try {
      const files = await fs.promises.readdir(imagesDir);

      // Filter for typical image extensions
      const imageFiles = files.filter((f) =>
        /\.(png|jpe?g|gif|webp|svg)$/i.test(f)
      );

      res.json({ files: imageFiles });
    } catch (err) {
      console.error("[adminproductRouter] Error listing product images", err);
      res.status(500).json({ error: "Failed to list product images" });
    }
  }
);

// existing routes
adminproductRouter.get("/products", validateAdminJWT, getAllProducts);
adminproductRouter.post("/products/item", validateAdminJWT, createProduct);
adminproductRouter.put("/products/:id", validateAdminJWT, updateProduct);
adminproductRouter.delete("/products/:id", validateAdminJWT, deleteProduct);

export default adminproductRouter;
