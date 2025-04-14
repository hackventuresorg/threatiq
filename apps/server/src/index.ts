import express from "express";
import cors from "cors";
import { PORT } from "./environments";
import connectDB from "./db";
import authRoutes from "./routes/auth";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀Server is running on http://localhost:${PORT}`);
});
