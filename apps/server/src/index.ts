import express from "express";
import cors from "cors";
import { PORT } from "./environments";
import connectDB from "./db";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong 🏓" });
});

app.listen(PORT, () => {
  console.log(`🚀Server is running on http://localhost:${PORT}`);
});
