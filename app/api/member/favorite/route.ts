// app/api/member/favorite/route.ts

import { connectDB } from "@/lib/db";
import { getMember } from "@/lib/getMember";
import { getUserId } from "@/lib/getUserId";
import Favorite from "@/model/favorite";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const userId = await getUserId(req);

  const favorites = await Favorite.find({
    userId,
  }).select("memberId -_id");

  const memberIds = favorites.map((f) => f.memberId);

  const formatted = await getMember(memberIds);

  return NextResponse.json(formatted, { status: 200 });
}
