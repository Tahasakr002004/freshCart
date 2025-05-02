import express from 'express';

import { getActiveCartForUser } from '../services/cartService'; // Adjust the import path as necessary
import validateJWT  from '../middlewares/validateJWT';
// import { createCartForUser } from '../services/cartService'; // Adjust the import path as necessary

const cartRouter = express.Router();



cartRouter.get('/', validateJWT, async (req, res) => {
  try {
    const userId = (req as any).user._id.toString(); // Assuming req.user contains the authenticated user's information
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  } catch (error) {
    console.error("Error fetching active cart:", error);
    res.status(500).send("Internal server error");
  }
});



export default cartRouter;