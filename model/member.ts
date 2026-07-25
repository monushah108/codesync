import { model, models, Schema } from "mongoose";

const memberSchema = new Schema({
  userId: Schema.Types.ObjectId,
  roomId: Schema.Types.ObjectId,
  banned: {
    type: String,
    default: false,
  },
});

const Member = models.Member || model("Member", memberSchema);

export default Member;
