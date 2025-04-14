import { Request, Response, NextFunction } from "express";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  next();
};
