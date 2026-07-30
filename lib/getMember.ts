import { db } from "./auth";

export async function getMember(members) {
  const users = await db
    .collection("user")
    .find(
      {
        _id: {
          $in: members,
        },
      },
      {
        projection: {
          _id: 1,
          name: 1,
          image: 1,
        },
      },
    )
    .toArray();

  return users;
}
