import express, { NextFunction, Request, Response } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { User } from "../db/models";
import { createOrganization, getAllOrganizations } from "../controllers/organization";

const router = express.Router();

router.post("/", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, location, type, logoUrl } = req.body;
    const clerkId = req.headers.clerk_user_id as string;

    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized: User ID not found in token" });
      return;
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const organization = await createOrganization({
      name,
      description,
      location,
      type,
      logoUrl,
      createdBy: user._id,
    });

    console.log("Organization created successfully::", organization);

    res.status(201).json({ message: "Organization created successfully", organization });
  } catch (error) {
    next(error);
  }
});

router.get("/getall", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.headers.clerk_user_id as string;
    const user = await User.findOne({ clerkId });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const allOrgs = await getAllOrganizations(user._id as string);
    res.status(200).json({ message: "All organizations fetched successfully", allOrgs });
    return;
  } catch (error) {
    next(error);
  }
});

export default router;
