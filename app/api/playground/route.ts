import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { consumeToken } from "@/lib/rateLimiter";
import { playSchema } from "@/lib/schema/playground";
import Directory from "@/model/directory";
import { Member } from "@/model/member";

import Room from "@/model/room";

import mongoose, { Types } from "mongoose";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { success } = consumeToken(req);

    if (!success) {
      return Response.json({ error: "rate limit exceeded" }, { status: 429 });
    }

    const userId = await getUserId(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find all rooms the user is banned from (these must NEVER appear on dashboard)
    const bannedMemberships = await Member.find({
      userId,
      banned: true,
    })
      .select("roomId")
      .lean();

    const bannedRoomIdSet = new Set(
      bannedMemberships.map((m) => m.roomId.toString()),
    );

    // 2. Find rooms where the user has an active membership (not banned)
    const activeMemberships = await Member.find({
      userId,
      banned: false,
    })
      .sort({ lastActiveAt: -1, updatedAt: -1 })
      .lean();

    const membershipMap = new Map(
      activeMemberships.map((m) => [m.roomId.toString(), m]),
    );

    // 3. Also find rooms owned by the user (in case legacy rooms lack Member records)
    const ownedRooms = await Room.find({
      adminId: userId,
    })
      .select("_id createdAt updatedAt")
      .lean();

    // Ensure owned rooms have a Member record
    for (const owned of ownedRooms) {
      const rId = owned._id.toString();
      if (!membershipMap.has(rId) && !bannedRoomIdSet.has(rId)) {
        // Upsert owner membership asynchronously without blocking
        Member.updateOne(
          { userId, roomId: owned._id },
          {
            $setOnInsert: {
              role: "owner",
              banned: false,
              joinedAt: owned.createdAt,
              lastActiveAt: owned.updatedAt || owned.createdAt,
            },
          },
          { upsert: true },
        ).exec();
      }
    }

    // 4. Combine all candidate room IDs and filter out banned ones
    const candidateRoomIds = [
      ...activeMemberships.map((m) => m.roomId.toString()),
      ...ownedRooms.map((r) => r._id.toString()),
    ].filter((id) => !bannedRoomIdSet.has(id));

    const uniqueRoomIds = Array.from(new Set(candidateRoomIds));

    if (uniqueRoomIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const rooms = await Room.find({
      _id: { $in: uniqueRoomIds },
    })
      .select("_id name tags projectType adminId createdAt updatedAt")
      .lean();

    const formattedRooms = rooms.map((room) => {
      const roomIdStr = room._id.toString();
      const membership = membershipMap.get(roomIdStr);
      const isOwner = room.adminId?.toString() === userId.toString();
      const role = isOwner ? "owner" : (membership?.role ?? "editor");
      const lastActiveAt =
        membership?.lastActiveAt || room.updatedAt || room.createdAt;

      return {
        _id: roomIdStr,
        name: room.name,
        tags: room.tags ?? [],
        projectType: room.projectType,
        adminId: room.adminId?.toString(),
        role,
        isOwner,
        lastActiveAt,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt,
      };
    });

    // Sort by recent activity (lastActiveAt) descending
    formattedRooms.sort(
      (a, b) =>
        new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime(),
    );

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

  const { success: isSuccess } = consumeToken(request);

  if (!isSuccess) {
    return Response.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { name, tags, projectType } = data;

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
        projectType,
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

    await Member.insertOne({
      userId,
      roomId,
      role: "owner"

    }, { session })

    session.commitTransaction();

    return Response.json(room, { status: 201 });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
