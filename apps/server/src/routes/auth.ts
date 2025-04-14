import express, { Request, Response, NextFunction } from "express";
import { login } from "../controllers/auth";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = req.body as UserDetails;
    const { clerkId, firstName, lastName, email, imageUrl, fullName } = userData;

    if (!clerkId || !firstName || !lastName || !email || !imageUrl || !fullName) {
      res.status(400).json({ message: "Missing required fields" });
    }

    await login(userData);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    next(error);
  }
});

export default router;
