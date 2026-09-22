import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },
  },
  {
    collection: "user",
    timestamps: true,
  },
);

const User = models.User || model("User", userSchema);

export default User;
