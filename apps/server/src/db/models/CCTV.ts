import mongoose, { Document, Schema, Types } from "mongoose";

interface ICCTV {
  name: string;
  location: string;
  publicIp: string;
  port: number;
  username: string;
  password: string;
  rtspPath: string;
  protocol: "rtsp" | "http" | "https";
  fullRTSPUrl?: string;
  isActive: boolean;
  streamHealth?: "online" | "offline" | "unstable";
  createdAt: Date;
  updatedAt: Date;
  organization: Types.ObjectId;
}

interface CCTVDocument extends ICCTV, Document {}

const CCTVSchema = new Schema<CCTVDocument>(
  {
    id: {
      type: String,
      required: [true, "Please provide a unique ID"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
    },
    publicIp: {
      type: String,
      required: [true, "Please provide a public IP or domain"],
      trim: true,
    },
    port: {
      type: Number,
      required: [true, "Please provide a port number"],
      default: 554,
    },
    username: {
      type: String,
      required: [true, "Please provide a username"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      trim: true,
    },
    rtspPath: {
      type: String,
      required: [true, "Please provide an RTSP path"],
      trim: true,
    },
    protocol: {
      type: String,
      enum: ["rtsp", "http", "https"],
      default: "rtsp",
      required: [true, "Please provide a protocol"],
    },
    fullRTSPUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    streamHealth: {
      type: String,
      enum: ["online", "offline", "unstable"],
      default: "offline",
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Please provide an organization"],
    },
  },
  { timestamps: true }
);

export default mongoose.model<CCTVDocument>("CCTV", CCTVSchema);
