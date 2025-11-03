import mongoose, { Schema, Document } from 'mongoose';

// Define an interface that extends mongoose's Document interface
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

// Create a schema for the user model
// The schema defines the structure of the documents in the collection
const userSchema: Schema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, },
  email: { type: String, },
  password: { type: String },
}
);

// Create the user model using the schema and the interface
// The model is a class that allows us to create and manage documents in the MongoDB collection
const userModel = mongoose.model<IUser>('users', userSchema);
//Export the user model so it can be used in other parts of the application
export default userModel;