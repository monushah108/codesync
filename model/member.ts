import { model, models, Schema } from "mongoose";

const memberSchema = new Schema(
  {
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
    role: {
      type: String,
      enum: ["owner", "editor", "viewer"],
      default: "editor",
    },
    banned: {
      type: Boolean,
      default: false,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

memberSchema.index({ roomId: 1, userId: 1 }, { unique: true });
memberSchema.index({ userId: 1, banned: 1, lastActiveAt: -1 });
memberSchema.index({ roomId: 1, banned: 1 });

export const Member = models.Member || model("Member", memberSchema);