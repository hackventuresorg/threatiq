import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { NextFunction, Request, Response } from "express";
import { User } from "../db/models";
import { createCCTV, getAllCCTV, editCCTV } from "../controllers/cctv";
import { startStreamWorker, stopStreamWorker } from "../controllers/rtsp_threat_pipeline";

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
      fullUrl,
      isActive,
      streamHealth,
      organization,
      tags,
      detectionSettings,
    } = req.body;

    const cctv = await createCCTV({
      name,
      location,
      fullUrl,
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

router.put("/", authenticateUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.headers.clerk_user_id as string;
    const user = await User.findOne({ clerkId });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }
    const {
      _id,
      name,
      location,
      fullUrl,
      isActive,
      streamHealth,
      organization,
      tags,
      detectionSettings,
    } = req.body;

    if(isActive){
      startStreamWorker(fullUrl, _id)
    } else {
      stopStreamWorker(fullUrl, _id)
    }

    const cctv = await editCCTV({
      _id,
      name,
      location,
      fullUrl,
      isActive,
      streamHealth,
      organization,
      tags,
      detectionSettings,
      user: user?._id,
    });
    res.status(201).json({ message: "CCTV updated successfully", cctv });
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
