import express from 'express';
import { getActiveCartForUser } from '../services/cartService'; // Adjust the import path as necessary
import validateJWT  from '../middlewares/validateJWT';
import { ExtendedRequest } from '../types/extendedRequed';
import { addItemToCart } from '../services/cartService'; // Adjust the import path as necessary
import { get } from 'mongoose';

const cartRouter = express.Router();



cartRouter.get('/', validateJWT, async (req: ExtendedRequest, res) => {
  
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
 
});

//////////////////////////////////////////////////////////

cartRouter.post('/items', validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req?.user?._id.toString(); // Assuming req.user contains the authenticated user's information
  const { productId, quantity } = req.body; // Assuming you send productId and quantity in the request body
  const response = await addItemToCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);

});

export default cartRouter;