import { model, models, Schema } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 15,
    },

    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
          minlength: 2,
          maxlength: 15,
        },
      ],
      default: [],
      validate: {
        validator(tags: string[]) {
          return tags.length <= 3;
        },
        message: "A room can have at most 3 tags.",
      },
    },
  },
  {
    timestamps: true,
  },
);

//
// INDEXES
//

// FAST ROOM SEARCH
roomSchema.index({
  name: "text",
});

// FAST ADMIN ROOM FETCH
roomSchema.index({
  adminId: 1,
});

// FAST ROOM TYPE FILTER
roomSchema.index({
  type: 1,
});

const Room = models.Room || model("Room", roomSchema);

export default Room;
