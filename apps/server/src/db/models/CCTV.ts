import mongoose, { Document, Schema, Types } from "mongoose";

interface ICCTV {
  name: string;
  location: string;
  fullUrl: string;
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
    fullUrl: {
      type: String,
      required: [true, "Please provide a full URL for the CCTV stream"],
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

export default mongoose.model<CCTVDocument>("CCTV", CCTVSchema);
