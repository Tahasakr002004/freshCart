import express from 'express';
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

productRouter.get('/:id', async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(404).send({ message: 'Product not found' });
  }
});

export default productRouter;
