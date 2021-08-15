import mongoose, { Document, Schema } from "mongoose";

type UserSchemaType = Document & {
  email: string;
  password: string;
  name: string;
};

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

export type { UserSchemaType };
export default mongoose.model<UserSchemaType>("AdminUser", userSchema);
