import { connectDB } from "@/lib/db";
// import { getMember } from "@/lib/getMember";

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
    const memberships = await Member.find({
      userId,
      banned: false,
    }).select("roomId role userId");

    const roomIds = memberships.map((m) => m.roomId);

    const rooms = await Room.find({
      _id: { $in: roomIds },
      isDeleted: false,
    })
      .select("name type adminId duration createdAt")
      .lean();

    // const members = memberships.map(i => i.userId)

    // const members = await getMember(members);

    const formated = {
      rooms,
      // members,
    };

    return Response.json(formated, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Internal Server Error" }, { status: 500 });
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
