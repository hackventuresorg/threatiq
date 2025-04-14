import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGO_URI = process.env.MONGO_URI || "";
export const CLERK_ISSUER = process.env.CLERK_ISSUER || "";
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || "";
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";
