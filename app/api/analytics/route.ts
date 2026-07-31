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

    const roomIds = myRooms.map((r) => r._id);

    const [totalRooms, totalTeamMembers, lastOpened, activeCollaborations] =
      await Promise.all([
        Room.countDocuments({
          adminId: userId,
          isDeleted: false,
        }),

        Member.countDocuments({
          roomId: { $in: roomIds },
          userId: { $ne: userId },
          banned: false,
        }),

        Member.findOne({ userId })
          .sort({ lastOpenedAt: -1 })
          .populate("roomId", "name")
          .lean(),

        Member.countDocuments({
          userId,
          roomId: { $nin: roomIds },
          banned: false,
        }),
      ]);

    return Response.json(
      [
        { id: "rc", value: totalRooms },
        { id: "ac", value: totalTeamMembers },
        { id: "tm", value: activeCollaborations },
        { id: "lo", value: lastOpened },
      ],
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
