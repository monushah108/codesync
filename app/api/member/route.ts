import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { consumeToken } from "@/lib/rateLimiter";
import { Member } from "@/model/member";
import Room from "@/model/room";
import "@/model/user";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

function rateLimit(request: NextRequest) {
  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const limited = rateLimit(request);
    if (limited) return limited;

    await connectDB();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const roomId = request.nextUrl.searchParams.get("roomId");

    // Case 1: Room-specific members query (used by StatusBar to list and manage collaborators)
    if (roomId) {
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
      }

      const room = await Room.findById(roomId).lean();
      if (!room) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }

      // Verify caller is a member or the room owner
      const callerMember = await Member.findOne({
        userId,
        roomId,
      }).lean();

      const isCallerOwner = room.adminId?.toString() === userId.toString();

      if (callerMember?.banned) {
        return NextResponse.json(
          { error: "You are banned from this room" },
          { status: 403 },
        );
      }

      if (!callerMember && !isCallerOwner) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 });
      }

      // Fetch all members of this room
      const members = await Member.find({ roomId })
        .populate("userId", "name email image")
        .sort({ createdAt: 1 })
        .lean();

      const formattedMembers = members.map((m: any) => {
        const userObj =
          m.userId && typeof m.userId === "object" ? m.userId : null;
        const memberUserId = userObj ? userObj._id?.toString() : m.userId?.toString();
        const isRoomOwner =
          room.adminId?.toString() === memberUserId || m.role === "owner";

        return {
          _id: m._id.toString(),
          userId: memberUserId,
          name: userObj?.name || "Collaborator",
          email: userObj?.email || "",
          image: userObj?.image || "",
          role: isRoomOwner ? "owner" : m.role,
          banned: m.banned ?? false,
          joinedAt: m.joinedAt,
          lastActiveAt: m.lastActiveAt,
          isOwner: isRoomOwner,
        };
      });

      // Ensure room owner is in the list
      if (!formattedMembers.some((m) => m.isOwner)) {
        const ownerUser = await mongoose.model("User").findById(room.adminId).lean();
        if (ownerUser) {
          formattedMembers.unshift({
            _id: "owner",
            userId: room.adminId.toString(),
            name: (ownerUser as any).name || "Owner",
            email: (ownerUser as any).email || "",
            image: (ownerUser as any).image || "",
            role: "owner",
            banned: false,
            joinedAt: room.createdAt,
            lastActiveAt: room.updatedAt || room.createdAt,
            isOwner: true,
          });
        }
      }

      return NextResponse.json({
        members: formattedMembers,
        isOwner: isCallerOwner,
        currentRole: isCallerOwner ? "owner" : (callerMember?.role ?? "editor"),
      });
    }

    // Case 2: General memberships query for current user
    const member = await Member.find({
      userId,
      banned: false,
    }).sort({ updatedAt: -1 });

    return NextResponse.json(member);
  } catch (error) {
    console.error("GET /api/member error:", error);
    return NextResponse.json({ error: "server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const limited = rateLimit(request);
    if (limited) return limited;

    await connectDB();

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { roomId } = body;

    if (!roomId || !mongoose.Types.ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid roomId" }, { status: 400 });
    }

    const room = await Room.findById(roomId).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    let member = await Member.findOne({ userId, roomId });
    if (member && member.banned) {
      return NextResponse.json(
        { error: "You are banned from this room" },
        { status: 403 },
      );
    }

    const isOwner = room.adminId?.toString() === userId.toString();

    if (!member) {
      member = await Member.create({
        userId,
        roomId,
        role: isOwner ? "owner" : "editor",
        banned: false,
        joinedAt: new Date(),
        lastActiveAt: new Date(),
      });
    } else {
      member.lastActiveAt = new Date();
      await member.save();
    }

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("POST /api/member error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}