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
      enum: ["owner", "admin", "editor", "viewer"],
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
  },
  {
    timestamps: true,
  },
);

memberSchema.index(
  {
    userId: 1,
    roomId: 1,
  },
  {
    unique: true,
  },
);

const Member = models.Member || model("Member", memberSchema);

export default Member;
