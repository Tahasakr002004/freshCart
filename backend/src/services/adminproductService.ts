//BUILD Bridge between ORM and ODM (postgresql and MONGODB) using EXPRESS
import productModel from "../models/mongodb/productModel";
import { Request, Response } from "express";







// CREATE
export const createProduct = async (req: Request, res: Response) => {
  try {
    const newProduct = await productModel.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};


// READ
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};


// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const updated = await productModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};


// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
