
import { Request } from 'express';

export interface ExtendedRequest extends Request {
  user?: any; // You can define a more specific type for user if needed
  // For example, you can create a User interface and use it here
}