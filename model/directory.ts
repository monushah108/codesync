import { model, models, Schema } from "mongoose";

const directorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  parentDirId: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: "Directory",
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
});

directorySchema.index({
  parentDirId: 1,
  roomId: 1,
  createdAt: 1,
});

const Directory = models.Directory || model("Directory", directorySchema);

export default Directory;
