import Room from "@/model/room";
import Share from "@/model/share";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }) {
  const { id } = await params;

  const share = await Share.findOne({ id });

  if (!share) {
    return NextResponse.json({
      message: "This link is invalid or expired",
    });
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

  const file = await Room.findById(share.roomId).populate(
    "userId",
    "picture name",
  );

  if (!file) {
    return NextResponse.json(
      {
        message:
          "The resource you are looking for has been deleted by the owner",
      },
      { status: 410 },
    );
  }

  return NextResponse.json(file, { status: 200 });
}
