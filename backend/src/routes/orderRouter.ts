// src/routes/orderRouter.ts
import express, { Request, Response, NextFunction } from 'express';
import validateJWT from '../middlewares/validateJWT';
import { ExtendedRequest } from '../types/extendedRequest';
import { checkout, showOrders } from '../services/orderService';

const orderRouter = express.Router();

/**
 * GET /order/items
 * Alle Bestellungen des eingeloggten Users holen
 */
orderRouter.get(
  '/items',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { data, statusCode } = await showOrders(user._id);
      res.status(statusCode).send(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).send({ message: 'Error fetching orders' });
    }
  }
);

/**
 * POST /order/checkout
 * Checkout-Prozess starten (Bestellung anlegen)
 */
orderRouter.post(
  '/checkout',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { address } = (req as ExtendedRequest).body;

      const { data, statusCode } = await checkout({
        userId: user._id,
        address,
      });

      res.status(statusCode).send(data);
    } catch (error) {
      console.error('Checkout failed:', error);
      res.status(500).send({ message: 'Checkout failed', error });
    }
  }
);

export default orderRouter;
