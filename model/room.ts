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

    type: {
      type: String,
      enum: ["public", "private"],
      required: true,
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

    duration: {
      type: String,
      enum: ["never", "7d", "24h"],
      default: "never",
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
          minlength: 2,
          maxlength: 20,
        },
      ],
      default: [],
      validate: {
        validator(tags: string[]) {
          return tags.length <= 5;
        },
        message: "A room can have at most 5 tags.",
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      default() {
        switch (this.duration) {
          case "24h":
            return new Date(Date.now() + 24 * 60 * 60 * 1000);

          case "7d":
            return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

          default:
            return null;
        }
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

// AUTO DELETE EXPIRED ROOM
roomSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

const Room = models.Room || model("Room", roomSchema);

export default Room;

// TODO: ttl index is not working and room with direcotry and file must get deleted too
