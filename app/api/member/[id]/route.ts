import { connectDB } from "@/lib/db";
import { getMember } from "@/lib/getMember";
import Member from "@/model/member";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: roomId } = await params;

  const members = await Member.find({
    roomId,
  }).select("userId role banned");

  const userIds = members.map((m) => m.userId);

  const users = await getMember(userIds);

  const userMap = new Map(
    users.map((user: any) => [user._id.toString(), user]),
  );

  const roomMembers = members.map((member) => ({
    ...userMap.get(member.userId.toString()),
    role: member.role,
    banned: member.banned,
  }));

  return NextResponse.json(roomMembers, {
    status: 200,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const body = await req.json();
  const { id } = await params;

  const member = await Member.findByIdAndUpdate(id, body, { new: true });

  return NextResponse.json(member);
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: roomId } = await params;
  const { userId } = await req.json();

  await Member.deleteOne({
    roomId,
    userId,
  });

  return NextResponse.json({
    message: "Member removed",
  });
}
