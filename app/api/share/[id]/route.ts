import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";
import Share from "@/model/share";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }) {
  await connectDB();
  const { id } = await params;
  const userId = await getUserId(req);
  const share = await Share.findOne({ token: id });

  if (!share) {
    return NextResponse.json(
      {
        message: "This link is invalid or expired",
      },
      { status: 400 },
    );
  }

  const isMember = await Member.findOne({ roomId: share.roomId, userId });

  if (isMember) {
    return NextResponse.json(
      {
        access: true,
        message: "access granted ",
        roomId: share.roomId,
      },
      { status: 200 },
    );
  }

  const isValidToken = share.verifyToken(id);

  if (!isValidToken) {
    return NextResponse.json(
      {
        message: "This link is invalid or expired",
      },
      {
        status: 404,
      },
    );
  }

  const room = await Room.findById(share.roomId);

  if (!room) {
    return NextResponse.json(
      {
        message:
          "The resource you are looking for has been deleted by the owner",
      },
      { status: 410 },
    );
  }

  return NextResponse.json(
    {
      access: false,
      name: room.name,
      type: room.type,
      roomId: room._id,
      createdAt: room.createdAt,
      adminId: room.adminId,
    },
    { status: 200 },
  );
}
