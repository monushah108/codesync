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

    projectType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ["static", "backend", "frontend", "terminal"],
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
      type: [String],
      default: [],
      set: (tags: string[]) => [
        ...new Set(tags.map((tag) => tag.trim().toLowerCase()).filter(Boolean)),
      ],
      validate: [
        {
          validator(tags: string[]) {
            return tags.length <= 3;
          },
          message: "A room can have at most 3 tags.",
        },
        {
          validator(tags: string[]) {
            return tags.every((tag) => tag.length >= 2 && tag.length <= 15);
          },
          message: "Each tag must be between 2 and 15 characters.",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

// FAST ROOM SEARCH
roomSchema.index({
  name: "text",
});

// FAST ADMIN ROOM FETCH
roomSchema.index({
  adminId: 1,
});

// FAST PROJECT TYPE FILTER
roomSchema.index({
  projectType: 1,
});

const Room = models.Room || model("Room", roomSchema);

export default Room;
