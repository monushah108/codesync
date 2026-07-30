import { connectDB } from "@/lib/db";
import { getMember } from "@/lib/getMember";

import { getUserId } from "@/lib/getUserId";
import { playSchema } from "@/lib/schema/playground";
import Directory from "@/model/directory";
import Member from "@/model/member";

import Room from "@/model/room";

import mongoose, { Types } from "mongoose";

import { NextRequest } from "next/server";
import z from "zod";

export async function GET(req: NextRequest) {
  await connectDB();

  const userId = await getUserId(req);

  try {
    // get the users
    const memberships = await Member.find({
      userId,
    }).select("roomId lastOpenedAt");

    const roomIds = memberships.map((m) => m.roomId);

    const rooms = await Room.find({
      _id: { $in: roomIds },
      isDeleted: false,
    })
      .select("name type adminId duration createdAt")
      .lean();

    const members = await Member.find({
      roomId: { $in: roomIds },
    })
      .select("userId roomId -_id")
      .lean();

    const userIds = members.map((i) => i.userId);

    const users = await getMember([...userIds]);

    const userMap = new Map(users.map((user) => [user._id.toString(), user]));

    // 7. Group members by room
    const roomMembers = new Map();

    for (const member of members) {
      const roomId = member.roomId.toString();

      if (!roomMembers.has(roomId)) {
        roomMembers.set(roomId, []);
      }

      const user = userMap.get(member.userId.toString());

      if (user) {
        roomMembers.get(roomId).push(user);
      }
    }

    const lastOpenedMap = new Map(
      memberships.map((member) => [
        member.roomId.toString(),
        member.lastOpenedAt,
      ]),
    );

    // 8. Build final response
    const formatted = rooms.map((room) => ({
      ...room,
      members: roomMembers.get(room._id.toString()) ?? [],
      lastOpened: lastOpenedMap.get(room._id.toString()) ?? null,
    }));

    return Response.json(formatted, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/* TODO: GET Room details taking so much time */

export async function POST(request: NextRequest) {
  await connectDB();
  const body = await request.json();
  const userId = await getUserId(request);
  const { success, data, error } = playSchema.safeParse(body);

  if (!success) {
    return Response.json(z.flattenError(error).fieldErrors, { status: 422 });
  }

  const { name, type, duration } = data;

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
        type: type,
        rootDirId,
        duration: duration,
      },
      { session },
    );

    await Member.insertOne(
      {
        userId,
        roomId,
        role: "admin",
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
    const formated = {
      roomId: room._id,
      name: room.name,
      type: room.type,
    };

    return Response.json(formated, { status: 201 });
  } catch (err) {
    console.log(err);
    session.abortTransaction();
    return Response.json({ error: "server Error" }, { status: 500 });
  }
}
