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
    return NextResponse.json({
      message: "This link is invalid or expired",
    });
  }

  const isAdmin = await Member.findOne({ userId });

  if (isAdmin) {
    return NextResponse.json(
      {
        message: "you are owner",
        roomId: share.roomId,
      },
      { status: 403 },
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

  return NextResponse.json(room, { status: 200 });
}
