import express, { NextFunction, Request, Response } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { getAllThreat } from "../controllers/threat";

const router = express.Router();

router.get("/getall", authenticateUser,async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cctvs } = req.query;
    const allThreats = await getAllThreat(cctvs as string);
    res.status(200).json({ message: "All organizations fetched successfully", allThreats });
  } catch (error) {
    next(error);
  }
});

export default router;