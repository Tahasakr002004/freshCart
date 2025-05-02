import { cartModel } from "../models/cartModel";
import productModel  from "../models/productModel";
import { ICart } from "../models/cartModel";

 interface CreateCartForUserRequest {
  userId: string; // Assuming userId is a string
}


export const createCartForUser = async ({userId}: CreateCartForUserRequest) => {

    const cart = await cartModel.create({ userId,totalAmount:0 });
    await cart.save(); // Save the cart to the database
    return cart;
}

///////////////////////////////////////////////////////////////

interface GetActiveCartRequest {
  userId: string; // Assuming userId is a string
}


export const getActiveCartForUser = async ({userId}:GetActiveCartRequest) => {
    let cart = await cartModel.findOne({ userId,status: "active" });   
    if(!cart) {
      cart = await createCartForUser({userId});
    }
    return cart;
};


interface AddItemToCartRequest {
  productId: any;
  quantity: number;
  userId: string;

}

///////////////////////////////////////////////////////////////
export const addItemToCart = async ({ userId, productId, quantity }: AddItemToCartRequest) => {
 
  // call the cart of user 
  const cart =  await getActiveCartForUser({ userId });


  const existsInCart = cart.items.find((item) => item.product.toString() === productId);

  if(existsInCart){
   // existsInCart.quantity += quantity;
    //await cart.save();
    return { data: "Item already exists in the Cart",statusCode:400 }
  }

  // Fetch the product from the database
  const product = await productModel.findById(productId);
  if(!product) {
    return { data: "Product not found",statusCode:400 }
  }



  // Update the product stock in the database
  if (product.stock < quantity) {
    return { data: "Not enough stock available", statusCode: 400 };
  }


  cart.items.push({
    product: productId,
    unitPrice: product.price,
    quantity,
  });

  cart.totalAmount += product.price * quantity; // Update the total amount

  const updatedCart = await cart.save();
    return { data: updatedCart, statusCode: 201 };
};




///////////////////////////////////////////////////////////////
interface UpdateItemInCartRequest {
  productId: any;
  quantity: number;
  userId: string;
}


// Update item in cart
export const updateItemInCart = async ({ userId, productId, quantity }: UpdateItemInCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  
  const existsInCart = cart.items.find((item) => item.product.toString() === productId);
  if (!existsInCart) {
    return { data: "Item not found in the cart", statusCode: 400 };
  }
  const product = await productModel.findById(productId);
  if(!product) {
    return { data: "Product not found",statusCode:400 }
  }



  existsInCart.quantity = quantity; // Update the quantity

  // Update the product stock in the database
  if (product.stock < quantity) {
    return { data: "Not enough stock available", statusCode: 400 };
  }

  let total = calculateTotalAmount({cart,productId});

   total += existsInCart.unitPrice * quantity; // Add the updated item price
  cart.totalAmount = total; // Update the total amount

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
};

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
interface DeleteItemInCartRequest {
  productId: any;
  userId: string;
}

export const deleteItemInCart = async ({ userId, productId}:DeleteItemInCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  
  // Check if the item exists in the cart
  const existsInCart = cart.items.find((item) => item.product.toString() === productId);
  if (!existsInCart) {
    return { data: "Item not found in the cart", statusCode: 400 };
  }
  
  const total = calculateTotalAmount({cart,productId});
  cart.totalAmount = total;
  const otherCartItems = cart.items.filter((item) => item.product.toString() !== productId);
  cart.items = otherCartItems;

  const updatedCart = await cart.save();

  return { data: updatedCart, statusCode: 200 };
}


interface ClearCartRequest {
  userId: string;
}


export const clearCart = async ({ userId }: ClearCartRequest) => {

  const cart = await getActiveCartForUser({ userId });
  cart.items = []; // Clear the items array
  cart.totalAmount = 0; // Reset the total amount
  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };

}




///////////////////////////////////////////////////////////////
const calculateTotalAmount = ({cart,productId}:{cart:ICart,productId:string}) => {

  const otherCartItems = cart.items.filter((item) => item.product.toString() !== productId);
  let total = otherCartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  return total;
} 
