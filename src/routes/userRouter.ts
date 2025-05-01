import express from 'express';
import { register } from '../services/userService'; // Adjust the import path as necessary
import { login } from '../services/userService'; // Adjust the import path as necessary

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  res.send('User route is working!');
});


userRouter.post('/register', async (req, res) => {
 
  // Call the register function from userService
  
     const { firstName, lastName, email, password } = req.body;
     const {statusCode,data} = await register({ firstName, lastName, email, password });
     // Check if the user already exists
  res.status(statusCode).send(data);

});


// Route for user login
userRouter.post('/login', async (req, res) => {
  const { email, password } =  req.body;
  const {statusCode,data} = await login({ email, password });
  // Check if the user already exists
  res.status(statusCode).send(data);
});



export default userRouter;
