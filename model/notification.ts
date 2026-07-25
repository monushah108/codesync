import { model, models, Schema } from "mongoose";

const notificationSchema = new Schema({
  senderId: Schema.Types.ObjectId,
  data: {
    type: String,
    default: "",
  },
  timeStamp: {
    data: new Date(),
  },
});

const Notification =
  models.Notification || model("Notification", notificationSchema);

export default Notification;
