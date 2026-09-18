import { model, models, Schema } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 25,
    },

    parentDirId: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Directory",
    },

    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Room",
    },

    content: {
      type: String,
      default: "",
      maxlength: 500_000,
    },
  },
  {
    timestamps: true,
  },
);

fileSchema.index({
  parentDirId: 1,
  roomId: 1,
  createdAt: 1,
});

const File = models.File || model("File", fileSchema);

export default File;
