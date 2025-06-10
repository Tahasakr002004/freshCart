import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  username: string;
  password: string; // Store hashed password in production
}

const adminSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const adminModel = mongoose.model<IAdmin>("Admin", adminSchema);
export default adminModel;
