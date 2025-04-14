import express, { Request, Response, NextFunction } from "express";
import { login } from "../controllers/auth";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body as UserDetails;
    const clerkId = req.headers.clerk_user_id as string;
    console.log("clerkId", clerkId);
    if (!clerkId) {
      res.status(401).json({ message: "Unauthorized: User ID not found in token" });
      return;
    }
    const { firstName, lastName, email, imageUrl, fullName } = userData;
    if (!firstName || !lastName || !email || !imageUrl || !fullName) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    await login({
      clerkId,
      firstName,
      lastName,
      email,
      imageUrl,
      fullName,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
});

export default router;
