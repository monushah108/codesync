import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Directory from "@/model/directory";
import File from "@/model/file";
import Room from "@/model/room";

import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const renameSchema = z.object({
  newName: z.string().trim().min(3).max(15),
});

async function getRoomId(params: Promise<{ roomId: string }>) {
  const { roomId } = await params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return null;
  }

  return roomId;
}

/**
 * GET /api/playground/:roomId
 *
 * Checks whether the current user can access the room.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    await connectDB();

    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = await getRoomId(params);

    if (!roomId) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const room = await Room.findOne({
      _id: roomId,
      adminId: userId,
    })

      .lean();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        id: room._id.toString(),
        name: room.name,
        type: room.type,
        tags: room.tags ?? [],

        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      },

      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/playground/:roomId error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/playground/:roomId
 *
 * Renames a room.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    await connectDB();

    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = await getRoomId(params);

    if (!roomId) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const body = await request.json();

    const { success, data, error } = renameSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(z.flattenError(error).fieldErrors, {
        status: 422,
      });
    }

    const room = await Room.findOne({
      _id: roomId,
      adminId: userId,
      isDeleted: false,
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Don't allow the same name as another room.
    const existingRoom = await Room.findOne({
      _id: { $ne: room._id },
      name: data.newName,
      isDeleted: false,
    })
      .select("_id")
      .lean();

    if (existingRoom) {
      return NextResponse.json(
        {
          error: "A room with this name already exists",
        },
        { status: 409 },
      );
    }

    room.name = data.newName;

    await room.save();

    return NextResponse.json(
      {
        roomId: room._id.toString(),
        name: room.name,
        type: room.type,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/playground/:roomId error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/playground/:roomId
 *
 * Soft deletes the room.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    await connectDB();

    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = await getRoomId(params);

    if (!roomId) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    // Only the room admin can permanently delete it
    const room = await Room.findOne({
      _id: roomId,
      adminId: userId,
    })
      .select("_id rootDirId")
      .lean();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Delete all files belonging to the room
    await File.deleteMany({
      roomId: room._id,
    });

    // Delete all directories belonging to the room
    await Directory.deleteMany({
      roomId: room._id,
    });

    // Finally delete the room
    await Room.deleteOne({
      _id: room._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room permanently deleted",
        roomId: room._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/playground/:roomId error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
