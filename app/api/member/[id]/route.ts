import { connectDB } from "@/lib/db";
import Member from "@/model/member";
import { NextResponse } from "next/server";

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
