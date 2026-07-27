import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return !["member_join", "member_leave", "ban", "system"].includes(
          this.type,
        );
      },
    },

    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
    },

    type: {
      type: String,
      enum: [
        "invite",
        "request",

        "member_join",
        "member_leave",
        "ban",
        "system",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    action: {
      type: String,
      enum: ["accepted", "decline", "read"],
      default: null,
    },

    expiresAt: {
      type: Date,
      default: null,
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.statics.hasPendingInvitation = async function (
  senderId,
  roomId,
) {
  return await this.exists({
    senderId,
    roomId,
    type: "invite",
    isRead: false,
  });
};

notificationSchema.pre("save", function () {
  const ttlTypes = ["member_join", "member_leave", "ban", "system"];

  if (ttlTypes.includes(this.type) && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
});

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
