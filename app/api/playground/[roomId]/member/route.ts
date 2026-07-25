import { connectDB } from "@/lib/db";
import Member from "@/model/member";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const roomId = req.nextUrl.searchParams.get("roomId");

  const members = await Member.find({ roomId }).populate("userId");

  return NextResponse.json(members);
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

  const { id } = await params;

  await Member.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Member removed",
  });
}
