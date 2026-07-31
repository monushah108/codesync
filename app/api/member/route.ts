import { connectDB } from "@/lib/db";
import { getMember } from "@/lib/getMember";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const userId = await getUserId(req);

  const myMemberships = await Member.find({
    userId,
  })
    .select("roomId")
    .lean();

  const roomIds = myMemberships.map((m) => m.roomId);

  const members = await Member.find({
    roomId: { $in: roomIds },
  })
    .select("roomId userId role banned lastOpenedAt")
    .lean();

  const userIds = members.map((i) => i.userId);

  const users = await getMember(userIds);

  const userMap = new Map(users.map((user) => [user._id.toString(), user]));

  const formatted: Record<string, any[]> = {};

  for (const member of members) {
    const roomId = member.roomId.toString();

    if (!formatted[roomId]) {
      formatted[roomId] = [];
    }

    const user = userMap.get(member.userId.toString());

    if (!user) continue;

    formatted[roomId].push({
      ...user,
      role: member.role,
      banned: member.banned,
      lastOpenedAt: member.lastOpenedAt,
    });
  }

  return NextResponse.json(formatted, {
    status: 200,
  });
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
