import express from 'express';
import { getAllProducts, getProductById } from '../services/productService'; // Adjust the import path as necessary


const productRouter = express.Router();

productRouter.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ message: 'Error fetching products' });
  }
}
);








export default productRouter;