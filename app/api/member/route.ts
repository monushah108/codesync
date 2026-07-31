import { connectDB } from "@/lib/db";
import { getMember } from "@/lib/getMember";
import Member from "@/model/member";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const roomId = req.nextUrl.searchParams.get("roomId");

  const members = await Member.find({ roomId }).select("userId lastOpenedAt");

  const userId = members.map((i) => i.userId);

  const getMemberDetails = await getMember(userId);

  const lastOpenedMap = new Map(
    members.map((member) => [member.roomId.toString(), member.lastOpenedAt]),
  );

  return NextResponse.json(
    {
      members: getMemberDetails,
      lastOpened: lastOpenedMap.get(roomId),
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const exists = await Member.findOne({
    roomId: body.roomId,
    userId: body.userId,
  });

  if (exists) {
    return NextResponse.json({ message: "Already a member" }, { status: 400 });
  }

  const member = await Member.create(body);

  return NextResponse.json(member, { status: 201 });
}
