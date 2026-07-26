import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
        "mention",
        "file",
        "folder",
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

notificationSchema.statics.isBanned = async function (senderId, roomId) {
  return await this.exists({
    senderId,
    roomId,
    type: "ban",
  });
};

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
