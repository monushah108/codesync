import { Schema, model, models } from "mongoose";

const favoriteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

favoriteSchema.index(
  {
    userId: 1,
    memberId: 1,
  },
  {
    unique: true,
  },
);

const Favorite = models.Favorite || model("Favorite", favoriteSchema);

export default Favorite;
