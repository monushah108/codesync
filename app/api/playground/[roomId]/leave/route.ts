import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import {
  CacheKeys,
  deleteCache,
  deleteCachePattern,
} from "@/lib/helper";
import { consumeToken } from "@/lib/rateLimiter";
import { Member } from "@/model/member";
import Room from "@/model/room";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

async function getRoomId(params: Promise<{ roomId: string }>) {
  const { roomId } = await params;

  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return null;
  }

  return roomId;
}

/**
 * Handler for leaving a workspace.
 * Allows non-owner collaborators (editors/viewers) to leave a joined room.
 */
async function handleLeaveRoom(
  request: NextRequest,
  params: Promise<{ roomId: string }>,
) {
  try {
    await connectDB();

    const { success } = consumeToken(request);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = await getRoomId(params);
    if (!roomId) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const room = await Room.findById(roomId).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Room owner cannot leave their own room; they must delete it instead
    const isOwner = room.adminId?.toString() === userId.toString();
    if (isOwner) {
      return NextResponse.json(
        {
          error:
            "Room owners cannot leave their own workspace. You can delete the workspace instead.",
        },
        { status: 400 },
      );
    }

    // Find and delete the user's membership in this room
    const member = await Member.findOneAndDelete({
      userId,
      roomId,
    });

    // Invalidate caches so the dashboard and active rooms immediately update
    await deleteCache(
      CacheKeys.userRooms(userId),
      CacheKeys.roomUser(roomId, userId),
      member ? CacheKeys.member(member._id.toString()) : null,
    );
    await deleteCachePattern(`room:${roomId}:members:*`);

    return NextResponse.json(
      {
        success: true,
        message: "Left workspace successfully",
        roomId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Leave room error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  return handleLeaveRoom(request, params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  return handleLeaveRoom(request, params);
}
