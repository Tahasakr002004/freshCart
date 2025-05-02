import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';
import path from 'path';
import { seedInitialProducts } from './services/productService';
import productRouter from './routes/productRouter';
import cartRouter from './routes/cartRouter';

const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/freshcartImages')));



//middleware for routes
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/carts', cartRouter);

///
mongoose.connect('mongodb://localhost:27017/fresh-cart').then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

//sedding initial products
seedInitialProducts();

////express listening to port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
