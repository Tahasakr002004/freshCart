// src/routes/productRouter.ts
import express, { Request, Response, NextFunction } from 'express';
import { getAllProducts, getProductById } from '../services/productService';

const productRouter = express.Router();

/**
 * GET /product
 * Alle Produkte holen
 */
productRouter.get(
  '/',
  async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const products = await getAllProducts();
      res.status(200).send(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send({ message: 'Error fetching products' });
    }
  }
);

/**
 * GET /product/:id
 * (Nur, wenn du getProductById nutzen willst – sonst kannst du diesen Handler weglassen)
 */
productRouter.get(
  '/:id',
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const product = await getProductById(id);

      if (!product) {
        res.status(404).send({ message: 'Product not found' });
        return;
      }

      res.status(200).send(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).send({ message: 'Error fetching product' });
    }
  }
);

export default productRouter;
