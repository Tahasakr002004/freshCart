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

const app = express();
const port = 5000;


app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4300'],
  credentials: true,
}));

// JSON-Body parsen
app.use(express.json());

// Static Files 
app.use('/images', express.static(path.join(__dirname, 'public/freshcartImages')));

// Routen
app.use('/admin', adminRouter);
app.use('/admin', adminproductRouter);
app.use('/user', userRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);

// DB-Verbindungen
export const connectDatabases = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://mongo:27017/fresh-cart', {});
    console.log("Connected to MongoDB");

    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Database connection failed", err);
  }
};

connectDatabases();

// Produkte beim Start seeden
seedInitialProducts();

// Server starten
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}` || `Server is running on port ${port}`);
});
