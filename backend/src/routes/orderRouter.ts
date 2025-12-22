import express, { Request, Response, NextFunction } from "express";
import validateAuth from "../middlewares/validateAuth";
import requireUser from "../middlewares/requireUser";
import { ExtendedRequest } from "../types/extendedRequest";
import { checkout, showOrders } from "../services/orderService";

const orderRouter = express.Router();

orderRouter.get(
  "/items",
  validateAuth,
  requireUser,
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    try {
      const { user } = req as ExtendedRequest;
      const { data, statusCode } = await showOrders(user._id);
      res.status(statusCode).send(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send({ message: "Error fetching orders" });
    }
  }
);

orderRouter.post(
  "/checkout",
  validateAuth,
  requireUser,
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
      console.error("Checkout failed:", error);
      res.status(500).send({ message: "Checkout failed", error });
    }
  }
);

export default orderRouter;
