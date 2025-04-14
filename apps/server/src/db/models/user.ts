import mongoose, { Document, Schema, Types } from "mongoose";

interface IUser {
  name: string;
  email: string;
  organization: Types.ObjectId;
  clerkId: string;
}

interface UserDocument extends IUser, Document {}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: [true, "Please provide a name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email!"],
    unique: true,
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: "organization",
  },
  clerkId: {
    type: String,
    required: [true, "Please provide a Clerk user ID"],
    unique: true,
  },
});

export default mongoose.model<UserDocument>("User", userSchema);
