import { db } from "./auth";

export async function getMember(members: string[]) {
  const users = await db
    .collection("user")
    .find(
      {
        id: {
          $in: members,
        },
      },
      {
        projection: {
          _id: 0,
          id: 1,
          name: 1,
          image: 1,
        },
      },
    )
    .toArray();

  return users;
}
