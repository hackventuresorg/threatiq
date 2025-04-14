import { Request, Response } from "express";
import User from "../db/models/user";

export const login = async (data: UserDetails) => {
  const { clerkId, firstName, lastName, email, imageUrl, fullName } = data;

  const user = await User.findOne({ clerkId });

  if (!user) {
    const newUser = new User({ clerkId, firstName, lastName, email, imageUrl, fullName });
    await newUser.save();
  }
};
