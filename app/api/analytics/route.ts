import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const userId = await getUserId(req);

    // Get user's owned rooms
    const myRooms = await Room.find({
      adminId: userId,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    const roomIds = myRooms.map((room) => room._id);

    const [totalRooms, totalTeamMembers, lastOpened] = await Promise.all([
      // Total rooms user belongs to
      Member.countDocuments({
        userId,
        banned: false,
      }),

      // Total members in user's rooms
      Member.countDocuments({
        roomId: {
          $in: roomIds,
        },
        userId: {
          $ne: userId,
        },
        banned: false,
      }),

      // Last opened room
      Member.findOne({
        userId,
      })
        .sort({
          lastOpenedAt: -1,
        })
        .select("lastOpenedAt roomId")
        .lean(),
    ]);

    return Response.json(
      {
        totalRooms,
        totalTeamMembers,
        lastOpened,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
