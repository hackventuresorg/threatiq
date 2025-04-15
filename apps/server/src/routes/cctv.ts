import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { NextFunction, Request, Response } from "express";
import { User } from "../db/models";
import { createCCTV, getAllCCTV } from "../controllers/cctv";

const router = Router();

router.post("/", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.headers.clerk_user_id as string;
    const user = await User.findOne({ clerkId });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const {
      name,
      location,
      publicIp,
      port,
      username,
      password,
      rtspPath,
      protocol,
      fullRTSPUrl,
      isActive,
      streamHealth,
      organization,
      tags,
      detectionSettings,
    } = req.body;

    const cctv = await createCCTV({
      name,
      location,
      publicIp,
      port,
      username,
      password,
      rtspPath,
      protocol,
      fullRTSPUrl,
      isActive,
      streamHealth,
      organization,
      tags,
      detectionSettings,
      user: user?._id,
    });
    res.status(201).json({ message: "CCTV created successfully", cctv });
  } catch (error) {
    next(error);
  }
});

router.get("/getall", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.headers.clerk_user_id as string;
    const user = await User.findOne({ clerkId });
    const { organization } = req.query;
    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const cctvs = await getAllCCTV({
      userId: user?._id as string,
      organizationId: organization as string,
    });

    res.status(200).json({ message: "CCTV fetched successfully", cctvs });
  } catch (error) {
    next(error);
  }
});
export default router;
