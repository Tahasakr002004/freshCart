// src/routes/cartRouter.ts
import express, { Request, Response, NextFunction } from 'express';
import validateJWT from '../middlewares/validateJWT';
import { ExtendedRequest } from '../types/extendedRequest';
import {
  getActiveCartForUser,
  addItemToCart,
  updateItemInCart,
  deleteItemInCart,
  clearCart,
} from '../services/cartService';

const cartRouter = express.Router();

/**
 * GET /cart
 * Aktiven Warenkorb des eingeloggten Users holen
 */
cartRouter.get(
  '/',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const cart = await getActiveCartForUser({ userId: user._id });
      res.status(200).send(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).send({ message: 'Error fetching cart' });
    }
  }
);

/**
 * POST /cart/items
 * Artikel in den Warenkorb legen
 */
cartRouter.post(
  '/items',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { productId, quantity } = (req as ExtendedRequest).body;

      const response = await addItemToCart({
        userId: user._id.toString(),
        productId,
        quantity,
      });

      res.status(response.statusCode).send(response.data);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).send({ message: 'Error adding item to cart' });
    }
  }
);

/**
 * PUT /cart/items
 * Artikel im Warenkorb aktualisieren (z. B. Menge ändern)
 */
cartRouter.put(
  '/items',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { productId, quantity } = (req as ExtendedRequest).body;

      const response = await updateItemInCart({
        userId: user._id,
        productId,
        quantity,
      });

      if (!response) {
        res.status(500).send({ error: 'Failed to update cart item.' });
        return;
      }

      res.status(200).send(response.data);
    } catch (error) {
      console.error('Error updating item in cart:', error);
      res.status(500).send({ message: 'Error updating item in cart' });
    }
  }
);

/**
 * DELETE /cart/items/:productId
 * Einzelnen Artikel aus dem Warenkorb löschen
 */
cartRouter.delete(
  '/items/:productId',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { productId } = req.params;

      const response = await deleteItemInCart({
        userId: user._id,
        productId,
      });

      res.status(response.statusCode).send(response.data);
    } catch (error) {
      console.error('Error deleting item from cart:', error);
      res.status(500).send({ message: 'Error deleting item from cart' });
    }
  }
);

/**
 * DELETE /cart
 * Gesamten Warenkorb leeren
 */
cartRouter.delete(
  '/',
  validateJWT,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;

      const response = await clearCart({ userId: user._id });

      res.status(response.statusCode).send(response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).send({ message: 'Error clearing cart' });
    }
  }
);

export default cartRouter;
