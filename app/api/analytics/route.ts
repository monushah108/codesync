import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const userId = await getUserId(req);

    // Total rooms where user is a member
    const totalRooms = Member.countDocuments({
      userId,
      banned: false,
    });

    // Rooms collaborated on (not owned)
    // const collaboratedRoomsPromise = Member.aggregate([
    //   {
    //     $match: {
    //       userId,
    //       banned: false,
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "rooms",
    //       localField: "roomId",
    //       foreignField: "_id",
    //       as: "room",
    //     },
    //   },
    //   {
    //     $unwind: "$room",
    //   },
    //   {
    //     $match: {
    //       "room.adminId": { $ne: userId },
    //       "room.isDeleted": false,
    //     },
    //   },
    //   {
    //     $count: "total",
    //   },
    // ]);

    // Rooms owned by user
    const myRooms = await Room.find({
      adminId: userId,
      isDeleted: false,
    }).select("_id");

    const roomIds = myRooms.map((room) => room._id);

    // Total members across owned rooms (excluding yourself)
    const totalTeamMembers = Member.countDocuments({
      roomId: { $in: roomIds },
      userId: { $ne: userId },
      banned: false,
    });

    const lastOpened = Member.findOne({ userId }).select("lastOpenedAt").lean();

    return Response.json({
      totalRooms,
      //   collaboratedRooms: collaboratedRooms[0]?.total ?? 0,
      totalTeamMembers,
      lastOpened,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
