import { Schema, model, models } from "mongoose";

const shareSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 7 * 60 * 60 * 24,
  },
});

shareSchema.methods.verifyToken = function (token) {
  return this.token == token;
};

const Share = models.Share || model("Share", shareSchema);

export default Share;
