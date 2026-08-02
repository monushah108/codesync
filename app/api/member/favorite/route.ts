// app/api/member/favorite/route.ts

import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Favorite from "@/model/favorite";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();

  const userId = await getUserId(req);

  const favorites = await Favorite.find({
    userId,
  }).populate({
    path: "favoriteUserId",
    select: "name image email",
  });

  return NextResponse.json(favorites);
}
