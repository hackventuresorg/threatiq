import mongoose, { Document, Schema, Types } from "mongoose";

export interface IOrganization {
  name: string;
  slug?: string;
  description?: string;
  location: string;
  type: string;
  users: Types.ObjectId[];
  cctvs: Types.ObjectId[];
  logoUrl?: string;
  isActive: boolean;
}

interface OrganizationDocument extends IOrganization, Document {}

const OrganizationSchema = new Schema<OrganizationDocument>(
  {
    name: {
      type: String,
      required: [true, "Please provide an organization name"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
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
    logoUrl: {
      type: String,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

OrganizationSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

export default mongoose.model<OrganizationDocument>("Organization", OrganizationSchema);
