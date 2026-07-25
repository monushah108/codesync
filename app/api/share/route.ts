import Share from "@/model/share";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { fileId, userId } = await req.json();

  const token = crypto.randomBytes(8).toString("hex");
  const isTokeAlredyExist = await Share.findOne({ userId, fileId });

  if (isTokeAlredyExist) {
    return NextResponse.json(isTokeAlredyExist, { status: 201 });
  }
  const link = await Share.create({
    userId,
    fileId,
    token,
  });

  return NextResponse.json(link, {
    status: 201,
  });
}
