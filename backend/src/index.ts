import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import sequelize from "./db/sequelize";
import path from "path";
import { seedInitialProducts } from "./services/productService";
import userRouter from "./routes/userRouter";
import adminRouter from "./routes/adminRouter";
import adminproductRouter from "./routes/adminproductRouter";
import productRouter from "./routes/productRouter";
import cartRouter from "./routes/cartRouter";
import orderRouter from "./routes/orderRouter";
import cors from "cors";
import { adminuserRouter } from "./routes/adminuserRouter";
import authRouter from "./routes/authRouter"; // ✅ NEW

dotenv.config();

const app = express();
const port = 5000;

app.use(
  cors({
    origin: ["http://localhost:4300", "http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "../public/freshcartImages")));

app.use("/auth", authRouter); // ✅ NEW
app.use("/admin", adminRouter);
app.use("/admin", adminproductRouter);
app.use("/admin", adminuserRouter);

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

export const connectDatabases = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://mongo:27017/fresh-cart", {});
    console.log("Connected to MongoDB");

    await sequelize.authenticate();
    console.log("Connected to PostgreSQL");
  } catch (err) {
    console.error("Database connection failed", err);
  }
};

connectDatabases();
seedInitialProducts();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}` || `Server is running on port ${port}`);
});
export default app;