// app/api/member/favorite/[id]/route.ts

import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Favorite from "@/model/favorite";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  await connectDB();

  const userId = await getUserId(request);
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const exists = await Favorite.findOne({
    userId,
    favoriteUserId: id,
  });

  if (exists) {
    return NextResponse.json({ message: "Already favorite" }, { status: 409 });
  }

  const favorite = await Favorite.create({
    userId,
    favoriteUserId: id,
  });

  return NextResponse.json(favorite);
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  await connectDB();

  const userId = await getUserId(request);
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid user id" }, { status: 400 });
  }

  const favorite = await Favorite.findOneAndDelete({
    userId,
    favoriteUserId: id,
  });

  if (!favorite) {
    return NextResponse.json(
      { message: "Favorite not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    message: "Favorite removed",
  });
}
