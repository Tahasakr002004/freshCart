import express from 'express';
import { register } from '../services/userService'; // Adjust the import path as necessary
import { login } from '../services/userService'; // Adjust the import path as necessary

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
  
  try{
    res.send('User route is working!');
  }catch(error){
    res.status(500).send({ message: 'Error fetching user route' });
  }
 
});


userRouter.post('/register', async (req, res) => {
 
  try{
      // Call the register function from userService
        
      const { firstName, lastName, email, password } = req.body;
      const {statusCode,data} = await register({ firstName, lastName, email, password });
      // Check if the user already exists
      res.status(statusCode).send(data);
  }catch(error){
    res.status(500).send({ message: 'Error registering user' });
  }
  

});


// Route for user login
userRouter.post('/login', async (req, res) => {
    try{
      const { email, password } =  req.body;
      const {statusCode,data} = await login({ email, password });
      // Check if the user already exists
      res.status(statusCode).send(data);
    }catch(error){
        res.status(500).send({ message: 'Error logging in user' });
    }
});



export default userRouter;
