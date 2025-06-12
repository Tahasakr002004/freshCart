import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { seedInitialProducts } from './services/productService';
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import productRouter from "./routes/productRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";


dotenv.config();
console.log(process.env.DATABASE_URL); //for testing

const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/freshcartImages')));



//middleware for routes
app.use('/admin', adminRouter); // Use the adminRouter for routes starting with /admin
app.use('/user', userRouter); // Use the userRouter for routes starting with /users
app.use('/product', productRouter); // Use the productRouter for routes starting with /products
app.use('/cart', cartRouter); // Use the cartRouter for routes starting with /carts
app.use('/order', orderRouter); // Use the cartRouter for routes starting with /carts

///
mongoose.connect(process.env.DATABASE_URL || '').then(() => {
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
