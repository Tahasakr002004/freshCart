import express from 'express';
import { checkout,showOrders } from '../services/orderService';
import validateJWT from '../middlewares/validateJWT';
import { ExtendedRequest } from '../types/extendedRequest';

const orderRouter = express.Router();

// get order
orderRouter.get("/items", validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user._id;
  const { data, statusCode } = await showOrders(userId);
  res.status(statusCode).send(data);
});



// Checkout endpoint
orderRouter.post('/checkout', validateJWT, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user._id;
    const { address } = req.body;
    const { data, statusCode } = await checkout({userId,address});
    res.status(statusCode).send(data);
  } catch (error) {
    res.status(500).send({ message: 'Checkout failed', error });
  }
});

export default orderRouter;