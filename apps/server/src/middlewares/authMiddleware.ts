import { Request, Response, NextFunction } from "express";
import { CLERK_SECRET_KEY } from "../environments";
import { verifyToken } from "@clerk/backend";

if (!CLERK_SECRET_KEY) {
  console.error("CLERK_SECRET_KEY is not set. Authentication will fail.");
}

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      clerk_user_id?: string;
    }
  }
}

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const payload = await verifyToken(token, { secretKey: CLERK_SECRET_KEY });

    req.userId = payload.sub || (payload.userId as string) || "";

    req.headers["clerk_user_id"] = payload.sub || (payload.userId as string) || "";

    next();
  } catch (verifyError) {
    res.status(401).json({ message: "Unauthorized: Token verification failed" });
    return;
  }
};
