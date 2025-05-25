import { model, Schema } from "mongoose";


const AuthSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    confirmpassword: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    }
  },
  { timestamps: true }
);

export const AuthModel = model("User", AuthSchema);






