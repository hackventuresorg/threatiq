// apps/server/src/db/models/CCTV.ts
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
  lastHealthCheck?: Date;
  organization: Types.ObjectId;
  tags?: string[];
  detectionSettings?: {
    detectFire: boolean;
    detectViolence: boolean;
    detectRobbery: boolean;
    detectSuspiciousBehavior: boolean;
    customDetections?: string[];
  };
}

interface CCTVDocument extends ICCTV, Document {}

const CCTVSchema = new Schema<CCTVDocument>(
  {
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
      select: false,
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
    lastHealthCheck: {
      type: Date,
      default: Date.now,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: [true, "Please provide an organization"],
      index: true,
    },
    detectionSettings: {
      detectFire: {
        type: Boolean,
        default: true,
      },
      detectViolence: {
        type: Boolean,
        default: true,
      },
      detectRobbery: {
        type: Boolean,
        default: true,
      },
      detectSuspiciousBehavior: {
        type: Boolean,
        default: true,
      },
      customDetections: [
        {
          type: String,
          trim: true,
        },
      ],
    },
  },
  { timestamps: true }
);

CCTVSchema.pre("save", function (next) {
  if (
    this.isModified("publicIp") ||
    this.isModified("port") ||
    this.isModified("username") ||
    this.isModified("password") ||
    this.isModified("rtspPath") ||
    this.isModified("protocol")
  ) {
    if (this.protocol === "rtsp") {
      this.fullRTSPUrl = `rtsp://${this.username}:${this.password}@${this.publicIp}:${this.port}${this.rtspPath}`;
    } else {
      this.fullRTSPUrl = `${this.protocol}://${this.publicIp}:${this.port}${this.rtspPath}`;
    }
  }
  next();
});

export default mongoose.model<CCTVDocument>("CCTV", CCTVSchema);
