import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8000;
export const NODE_ENV = process.env.NODE_ENV || "development";
export const MONGO_URI = process.env.MONGO_URI || "";
export const CLERK_ISSUER = process.env.CLERK_ISSUER || "";
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY || "";
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";
export const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || "";
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY || "";
export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME || "";
export const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
export const NOVU_SECRET_KEY = process.env.NOVU_SECRET_KEY || "";
export const IN_APP_WORKFLOW_ID = process.env.IN_APP_WORKFLOW_ID || ""; 
export const ENABLE_RTSP_STREAMING = process.env.ENABLE_RTSP_STREAMING || false;