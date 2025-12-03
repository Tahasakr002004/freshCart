
import userModel from "../models/mongodb/userModel";
import { Request, Response } from "express";
// import { User } from "../models/User";


// DELETE
export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};


export async function getAllUsers(_req: Request, res: Response): Promise<void> {
  try {
    const users = await userModel.find();

    res.status(200).json(users);
  } catch (error) {
    console.error("...Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
}
