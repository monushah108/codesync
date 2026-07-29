import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Share from "@/model/share";
import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";

export async function POST(req: NextRequest) {
  await connectDB();

  const userId = await getUserId(req);
  const { roomId } = await req.json();

  if (!roomId) {
    return NextResponse.json(
      { message: "roomId is required" },
      { status: 400 },
    );
  }

  const existingLink = await Share.findOne({ roomId });

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
