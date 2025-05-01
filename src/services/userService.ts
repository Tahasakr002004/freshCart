
import  userModel  from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};


interface LoginData {
  email: string;
  password: string;
};

// Function to generate a JWT token
const generateJWT = (data:any) => {
  // Function to generate a JSON Web Token (JWT) for user authentication
  // The JWT is used to securely transmit information between the client and server
  // The token is signed using a secret key and contains user information and expiration time
  // The token can be used for authentication in subsequent requests
  // The token is usually sent in the Authorization header of HTTP requests
  // The token is usually a long string of characters that is difficult to guess

  return jwt.sign(data, "16C7AAD7E3593F22B89E6C1A3D89F");
}


export const register = async ({ firstName, lastName, email, password }: RegisterData) => {
  // Check if the user already exists
  // The findOne method is used to search for a document in the MongoDB collection that matches the specified criteria
  const findUser = await userModel.findOne({ email: email });
  if (findUser) {
   return  { data: "user is already existed", statusCode: 401 };
  }
  // Hash the password using bcrypt
  // The hash method is used to create a hashed version of the password
  // The hashed password is stored in the database for security reasons
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user document using the user model
  // The create method is used to insert a new document into the MongoDB collection
  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });
  // Return the newly created user document
  await newUser.save();
  return {data: generateJWT({firstName:newUser.firstName,lastName:newUser.lastName,email:newUser.email}),statusCode: 200};
};


// Function to check if a user is already registered
//////////////////////////////////////////////////////////////
// Function to login a user
export const login = async ({ email, password }: LoginData) => {
  // Find the user by email and password
  // The findOne method is used to search for a document in the MongoDB collection that matches the specified criteria
  const findUser = await userModel.findOne({ email:email });
  if (!findUser) {
    return { data: "user is not existed", statusCode: 401 };
  }
  // Check if the user is verified4
  // The compareSync method is used to compare the provided password with the hashed password stored in the database
  const passwordMatch =await bcrypt.compare(password, findUser.password);
  // The password is compared to the hashed password stored in the database 
  if (!passwordMatch) {
    return { data: "password is not correct", statusCode: 401 };
  }
  
  // Return the found user document
  return { data: generateJWT({firstName:findUser.firstName,lastName:findUser.lastName,email:findUser.email}), statusCode: 200 };
};
