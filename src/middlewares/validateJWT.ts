import userModel  from '../models/userModel';
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from '../types/extendedRequest';




const validateJWT = (req:ExtendedRequest, res:Response, next:NextFunction) => { 

  // Check if the authorization header is present and starts with 'Bearer '
  const autherizationHeader = req.get("authorization");

  if (!autherizationHeader) {
    res.status(403).send('Authorization header is missing');
    return;
  }
  const token = autherizationHeader.split(" ")[1];
  if (!token) {
    res.status(403).send('Token is missing');
    return;
  }
  // If token is valid, you can attach the decoded user information to the request Object
  jwt.verify(token, process.env.JWT_SECRET || '', async (err, Payload) => {
    if (err) {
      res.status(403).send('Invalid token');
      return;
    }
    if (!Payload) {
      res.status(403).send('Invalid token payload');
      return;
    }
    const userPayload = Payload as any;
    const user = await userModel.findOne({ email: userPayload.email });
    req.user = user; 
    next();
  });
  
  
}






export default validateJWT;