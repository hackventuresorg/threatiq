import express from "express";
import cors from "cors";
import { PORT, ENABLE_RTSP_STREAMING } from "./environments";
import connectDB from "./db";
import authRoutes from "./routes/auth";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import organizationRoutes from "./routes/organization";
import cctvRoutes from "./routes/cctv";
import threatRouter from "./routes/threat";
import { startRtspThreatPipeline } from "./controllers/rtsp_threat_pipeline";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function (body) {
    console.log(new Date().toLocaleString(), req.method, req.originalUrl, res.statusCode);
    return originalSend.call(this, body);
  };
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/organization", organizationRoutes);
app.use("/api/cctv", cctvRoutes);
app.use("/api/threat", threatRouter);

app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log(`🚀Server is running on http://localhost:${PORT}`);
});

if (ENABLE_RTSP_STREAMING === "true") {
  startRtspThreatPipeline().catch((err) =>
    console.error("Failed to start RTSP threat pipeline:", err)
  );
}
