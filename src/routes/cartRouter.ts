import express from 'express';
import { getActiveCartForUser,addItemToCart,updateItemInCart } from '../services/cartService'; 
import validateJWT  from '../middlewares/validateJWT';
import { ExtendedRequest} from '../types/extendedRequest';



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



///////////////////////////////////////////////////////////////////////////////////
cartRouter.put('/items', validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user._id; 
  const { productId, quantity } = req.body; 
  console.log(req.body);
  let response = await updateItemInCart({ userId, productId, quantity });

  if (!response) {
    res.status(500).send({ error: "Failed to update cart item." });
    return;
  }

    res.status(200).send(response.data);
});

export default cartRouter;