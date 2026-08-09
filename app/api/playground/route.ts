import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { playSchema } from "@/lib/schema/playground";
import Directory from "@/model/directory";

import Room from "@/model/room";

import mongoose, { Types } from "mongoose";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rooms = await Room.find({
      adminId: userId,
      isDeleted: false,
    })
      .select("_id name tags createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const formattedRooms = rooms.map((room) => ({
      _id: room._id.toString(),
      name: room.name,
      tags: room.tags ?? [],
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    }));

    return NextResponse.json(formattedRooms, {
      status: 200,
    });
  } catch (error) {
    console.error("GET /api/playground error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const userId = await getUserId(request);
  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { name, tags } = data;

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const isRoomExists = await Room.findOne({
      $text: { $search: name },
    }).lean();

    if (isRoomExists) {
      return Response.json(
        { error: "A room with this name already exists" },
        { status: 409 },
      );
    }

    const rootDirId = new Types.ObjectId();
    const roomId = new Types.ObjectId();

    const room = await Room.insertOne(
      {
        _id: roomId,
        adminId: userId,
        name: name,
        tags,
        rootDirId,
      },
      { session },
    );

    await Directory.insertOne(
      {
        _id: rootDirId,
        name,
        roomId,
      },
      { session },
    );

    session.commitTransaction();

    return Response.json(room, { status: 201 });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
