import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Room from "@/model/room";

import mongoose from "mongoose";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

    await Member.updateOne(
      { userId, roomId },
      {
        $set: {
          lastOpenedAt: new Date(),
        },
      },
    );

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

const renameSchema = z.object({
  newName: z.string().trim().min(3).max(15),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const userId = await getUserId(req);
  const { id } = await params;

  const body = await req.json();

  const { success, data, error } = renameSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, {
      status: 422,
    });
  }

  const room = await Room.findOne({
    _id: id,
    adminId: userId,
  });

  if (!room) {
    return Response.json({ error: "Room not found." }, { status: 404 });
  }

  const isRoomExists = await Room.findOne({
    $text: { $search: data.newName },
  }).lean();

  if (isRoomExists) {
    return Response.json(
      { error: "A room with this name already exists" },
      { status: 409 },
    );
  }

  room.name = data.newName;
  await room.save();

  return NextResponse.json(
    {
      roomId: room._id,
      name: room.name,
      type: room.type,
    },
    { status: 201 },
  );
}

/* TODO: DELETE ROOM by setting isDeleted true and after it's get true set ttl index on each file and folder and room that within 15days it has to be deleted  */
