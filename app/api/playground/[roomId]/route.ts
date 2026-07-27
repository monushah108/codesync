import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";

import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,

  {
    params,
  }: {
    params: Promise<{
      roomId: string;
    }>;
  },
) {
  await connectDB();
  const userId = await getUserId(request);

  try {
    const { roomId } = await params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return Response.json(
        {
          error: "Invalid room id",
        },
        {
          status: 400,
        },
      );
    }

    const room = await Room.findById(roomId).lean();

    const isMember = await Member.findOne({ roomId, userId });

    if (!isMember) {
      return NextResponse.json(
        {
          access: false,
          reason: "not_member",
          message: "access denied ",
        },
        { status: 403 },
      );
    }

    const isBannedMember = await Member.isBanned(userId, roomId);

    if (isBannedMember) {
      return NextResponse.json(
        {
          access: false,
          reason: "banned",
          message: `you got banned from ${room.name} room`,
        },
        { status: 403 },
      );
    }

    if (!room) {
      return Response.json(
        {
          error: "No room founded !!",
        },
        {
          status: 404,
        },
      );
    }

    if (room.expiresAt && new Date(room.expiresAt) < new Date()) {
      return Response.json(
        {
          error: "Room expired",
        },
        {
          status: 410,
        },
      );
    }

    if (room.type === "private" && !isMember) {
      return Response.json(
        {
          access: false,
          reason: "private",
          error: "This is a private room",
        },
        {
          status: 403,
        },
      );
    }

    return Response.json(
      { access: true, msg: "granted", roomId: room._id },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Server error",
      },
      {
        status: 500,
      },
    );
  }
}
