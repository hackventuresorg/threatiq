import express, { NextFunction, Request, Response } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { getAllThreat } from "../controllers/threat";
import { User } from "../db/models";
import { BadRequestError } from "../middlewares/errorMiddleware";

const router = express.Router();

router.get("/getall", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cctvs } = req.query;

    const clerkId = req.headers.clerk_user_id as string;

    const user = await User.findOne({ clerkId });

    if (!user) {
      throw new BadRequestError("User not found");
    }

    const allThreats = await getAllThreat(user._id as string, cctvs as string);
    res.status(200).json({ message: "All organizations fetched successfully", allThreats });
  } catch (error) {
    next(error);
  }
});

export default router;
