import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import sequelize from './db/sequelize';
import path from 'path';
import { seedInitialProducts } from './services/productService';
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import adminproductRouter from "./routes/adminproductRouter";
import productRouter from "./routes/productRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";
import cors from 'cors';


dotenv.config();
console.log(process.env.DATABASE_URL); //for testing

const app = express();
const port = 5000;

app.use(cors({
  origin: 'http://localhost:4200', // Angular dev server
  credentials: true
}));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/freshcartImages')));



//middleware for routes
app.use('/admin', adminRouter); 
app.use('/admin', adminproductRouter); 
app.use('/user', userRouter); 
app.use('/product', productRouter); // Use the productRouter for routes starting with /product
app.use('/cart', cartRouter); 
app.use('/order', orderRouter);

///
export const connectDatabases = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/fresh-cart', {});
    console.log("Connected to MongoDB");

    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Database connection failed", err);
  }
};
connectDatabases();

//sedding initial products
seedInitialProducts();

////express listening to port 5000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}` || `Server is running on port ${port}`);
});
