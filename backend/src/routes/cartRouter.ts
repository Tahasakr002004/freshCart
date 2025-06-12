import express from 'express';
import {
  getActiveCartForUser,
  addItemToCart, 
  updateItemInCart,
  deleteItemInCart,
  clearCart,
  checkoutCart
} from '../services/cartService'; 
import validateJWT  from '../middlewares/validateJWT';
import { ExtendedRequest} from '../types/extendedRequest';



const cartRouter = express.Router();



cartRouter.get('/', validateJWT, async (req: ExtendedRequest, res) => {
  try {
    const userId = req.user._id;
    const cart = await getActiveCartForUser({ userId });
    res.status(200).send(cart);
  }catch(error) {
    res.status(500).send({ message: 'Error fetching cart' });
  }
   
});

//////////////////////////////////////////////////////////

cartRouter.post('/items', validateJWT, async (req: ExtendedRequest, res) => {
  try{
    const userId = req?.user?._id.toString(); // Assuming req.user contains the authenticated user's information
    const { productId, quantity } = req.body; // Assuming you send productId and quantity in the request body
    const response = await addItemToCart({ userId, productId, quantity });
    res.status(response.statusCode).send(response.data);
  
  }catch(error){

    res.status(403).send({ message: 'Error adding item to cart' });
  }
  
});



///////////////////////////////////////////////////////////////////////////////////
cartRouter.put('/items', validateJWT, async (req: ExtendedRequest, res) => {
  try{
    const userId = req.user._id; 
    const { productId, quantity } = req.body; 
    // console.log(req.body);
    let response = await updateItemInCart({ userId, productId, quantity });
  
    if (!response) {
      res.status(500).send({ error: "Failed to update cart item." });
      return;
    }
  
      res.status(200).send(response.data);
  }catch(error){
    res.status(403).send({ message: 'Error updating item in cart' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
//DELETE ITEM IN Cart
cartRouter.delete('/items/:productId', validateJWT, async (req: ExtendedRequest, res) => {
  try{
    const userId = req.user._id; // Assuming req.user contains the authenticated user's information
    const {productId} = req.params;
    console.log(userId,productId);
     const response = await deleteItemInCart({ userId, productId });
     res.status(response.statusCode).send(response.data);
  }catch(error){
    res.status(403).send({ message: 'Error deleting item from cart' });
  }
  
});


/////////////////////////////////////////////////////////////////////////////////////////
//clear all cart
cartRouter.delete('/', validateJWT, async (req: ExtendedRequest, res) => {
  const userId = req.user._id; 
  const response = await clearCart({ userId });
  res.status(response.statusCode).send(response.data);
});
//////////////////////////////////////////////////////////////////////////
//checkout cart

cartRouter.post('/checkout', validateJWT, async (req: ExtendedRequest, res) => {

  try{
    const  userId = req.user._id; 
    const {address} = req.body;
    const response = await checkoutCart({ userId, address });
    res.status(response.statusCode).send(response.data);
  }catch(error){
    res.status(403).send({ message: 'Error checking out cart' });
  }
  
});


  

export default cartRouter;  