import express, { Request, Response, NextFunction } from 'express';
import productModel from '../models/mongodb/productModel'; // ggf. Pfad prüfen

const productRouter = express.Router();

/**
 * GET /products
 * Optional Query: ?page=1&limit=12
 */
productRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Query-Parameter sauber in Zahlen umwandeln
      const page = parseInt((req.query.page as string) ?? '1', 10);
      const limit = parseInt((req.query.limit as string) ?? '12', 10);

      const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
      const safeLimit = Number.isNaN(limit) || limit < 1 ? 12 : limit;
      const skip = (safePage - 1) * safeLimit;

      const [products, total] = await Promise.all([
        productModel.find().skip(skip).limit(safeLimit),
        productModel.countDocuments(),
      ]);

      res.status(200).json({
        data: products,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total,
          pages: Math.ceil(total / safeLimit),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /products/:id
 */
productRouter.get(
  '/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productModel.findById(req.params.id);

      if (!product) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.status(200).json({ data: product });
    } catch (err) {
      next(err);
    }
  }
);

export default productRouter;
