import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { consumeToken } from "@/lib/rateLimiter";
import { Member } from "@/model/member";
import Room from "@/model/room";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

function rateLimit(request: NextRequest) {
  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json(
      { error: "rate limit exceeded" },
      { status: 429 },
    );
  }

  return null;
}

const updateMemberSchema = z.object({
  role: z.enum(["editor", "viewer"]).optional(),
  banned: z.boolean().optional(),
});

/**
 * GET /api/member/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const limited = rateLimit(request);
    if (limited) return limited;

    await connectDB();

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const member = await Member.findById(id).lean();
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    return NextResponse.json(member, { status: 200 });
  } catch (error) {
    console.error("GET /api/member/:id error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

/**
 * PATCH /api/member/:id
 *
 * Allows ONLY the room owner to edit a user's role (editor/viewer)
 * or ban/unban the user.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const limited = rateLimit(request);
    if (limited) return limited;

    await connectDB();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const body = await request.json();
    const { success, data, error } = updateMemberSchema.safeParse(body);
    if (!success) {
      return NextResponse.json(z.flattenError(error).fieldErrors, {
        status: 422,
      });
    }

    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const room = await Room.findById(member.roomId).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ONLY the room owner can edit roles or ban users
    const isOwner = room.adminId?.toString() === userId.toString();
    if (!isOwner) {
      return NextResponse.json(
        { error: "Only the room owner has permission to manage members" },
        { status: 403 },
      );
    }

    // Prevent owner from demoting or banning themselves
    if (member.userId.toString() === userId.toString()) {
      return NextResponse.json(
        { error: "Owner cannot change their own role or ban themselves" },
        { status: 400 },
      );
    }

    if (data.role !== undefined) {
      member.role = data.role;
    }

    if (data.banned !== undefined) {
      member.banned = data.banned;
    }

    await member.save();

    return NextResponse.json(
      {
        success: true,
        member: {
          _id: member._id.toString(),
          userId: member.userId.toString(),
          roomId: member.roomId.toString(),
          role: member.role,
          banned: member.banned,
          lastActiveAt: member.lastActiveAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/member/:id error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/member/:id
 *
 * Allows ONLY the room owner to remove a user from the room.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const limited = rateLimit(request);
    if (limited) return limited;

    await connectDB();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid member id" }, { status: 400 });
    }

    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const room = await Room.findById(member.roomId).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // ONLY the room owner can remove users from the room
    const isOwner = room.adminId?.toString() === userId.toString();
    if (!isOwner) {
      return NextResponse.json(
        { error: "Only the room owner has permission to remove members" },
        { status: 403 },
      );
    }

    // Prevent owner from removing themselves
    if (member.userId.toString() === userId.toString()) {
      return NextResponse.json(
        { error: "Owner cannot remove themselves from the room" },
        { status: 400 },
      );
    }

    await Member.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Member removed from room successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/member/:id error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}