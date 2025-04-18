import { Schema, model, Document, Types } from "mongoose";

export interface IThreat extends Document {
  type: "suspicious_behavior";
  confidence: number;
  risk_score: number;
  details: {
    reason: string;
    people_count: number;
    possible_actions: string[];
    faces_visible: number;
  };
  cctv: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ThreatSchema = new Schema<IThreat>(
  {
    type: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    risk_score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    details: {
      reason: { type: String, required: true },
      people_count: { type: Number, required: true },
      possible_actions: [{ type: String, required: true }],
      faces_visible: { type: Number, required: true },
    },
    cctv: {
      type: Schema.Types.ObjectId,
      ref: "CCTV",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Threat = model<IThreat>("Threat", ThreatSchema);
