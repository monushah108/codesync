import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Share from "@/model/share";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  await connectDB();

  const { roomId, userId } = await req.json();

  if (!roomId || !userId) {
    return NextResponse.json(
      { message: "fileId and userId are required" },
      { status: 400 },
    );
  }

  const existingLink = await Share.findOne({ roomId, userId });

  if (existingLink) {
    return NextResponse.json(existingLink, { status: 200 });
  }

  const token = crypto.randomBytes(8).toString("hex");

  const link = await Share.create({
    roomId,
    userId,
    token,
  });

  return NextResponse.json({ token }, { status: 201 });
}
