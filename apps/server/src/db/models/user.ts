import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  imageUrl?: string;
  organizations: Types.ObjectId[];
  clerkId: string;
}

interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    organizations: [
      {
        type: Schema.Types.ObjectId,
        ref: "Organization",
      },
    ],
    clerkId: {
      type: String,
      required: [true, "Please provide a Clerk user ID"],
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.virtual("name").get(function () {
  return this.fullName || `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", function (next) {
  if (this.isModified("firstName") || this.isModified("lastName")) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }
  next();
});

export default mongoose.model<UserDocument>("User", userSchema);
