import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter';

const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/fresh-cart').then(() => {
  
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB", err);
});

app.use('/user', userRouter);

////express listening to port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
