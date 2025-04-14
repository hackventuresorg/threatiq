import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrganization {
  name: string;
  location: string;
  type: string;
  users: Types.ObjectId[];
  cctvs: Types.ObjectId[];
}

interface OrganizationDocument extends IOrganization, Document {}

const OrganizationSchema = new Schema<OrganizationDocument>(
  {
    name: {
      type: String,
      required: [true, "Please provide an organization name"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please provide an organization type"],
      trim: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    cctvs: [
      {
        type: Schema.Types.ObjectId,
        ref: "CCTV",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<OrganizationDocument>("Organization", OrganizationSchema);
