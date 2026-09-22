import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import { deleteCache, getCache, setCache } from "@/lib/helper";
import { consumeToken } from "@/lib/rateLimiter";
import Directory from "@/model/directory";
import File from "@/model/file";
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

async function checkCanEdit(request: NextRequest, roomId: string) {
  const userId = await getUserId(request);
  if (!userId) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const room = await Room.findById(roomId).select("adminId").lean();
  if (!room) {
    return { error: NextResponse.json({ error: "Room not found" }, { status: 404 }) };
  }
  if (room.adminId?.toString() === userId.toString()) {
    return { allowed: true, userId };
  }
  const member = await Member.findOne({ userId, roomId, banned: false }).lean();
  if (!member || member.role === "viewer") {
    return {
      error: NextResponse.json(
        { error: "Viewers cannot edit, create, or delete folders in this room" },
        { status: 403 },
      ),
    };
  }
  return { allowed: true, userId };
}

/* =========================
   GET → Lazy Load Folders
========================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await getRoomId(params);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  const parentId = request.nextUrl.searchParams.get("parentId");
  const cacheKey = `room:${roomId}:parent:${parentId ?? "root"}`;

  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    // 1. Redis
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // 2. MongoDB
    await connectDB();

    const room = await Room.findById(roomId).select("rootDirId").lean();

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const folderId = parentId ?? room.rootDirId;

    const [rootFolder, folders, files] = await Promise.all([
      Directory.findById(folderId).lean(),

      Directory.find({
        parentDirId: folderId,
      })
        .sort({ createdAt: 1 })
        .lean(),

      File.find({
        parentDirId: folderId,
      })
        .sort({ createdAt: 1 })
        .lean(),
    ]);

    if (!rootFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    const responseData = {
      parentId: folderId,
      rootFolder,
      folders,
      files,
    };

    // 3. Redis SET
    await setCache(cacheKey, responseData, 60);

    return NextResponse.json(responseData);
  } catch (err) {
    console.error("Failed to fetch folders:", err);

    return NextResponse.json(
      { error: "Failed to fetch folders" },
      { status: 500 },
    );
  }
}

/* =========================
   POST → Create Folder
========================= */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await getRoomId(params);

  const { success } = consumeToken(request);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }
  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    await connectDB();

    const editCheck = await checkCanEdit(request, roomId);
    if (editCheck.error) {
      return editCheck.error;
    }

    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const cacheKey = `room:${roomId}:parent:${parentId || "root"}`;

    const folder = await Directory.create({
      name,
      parentDirId: parentId || null,
      roomId,
    });

    await deleteCache(cacheKey);

    return NextResponse.json(folder, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "failed to create folder" },
      { status: 500 },
    );
  }
}

/* =========================
   DELETE Folder
========================= */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await getRoomId(params);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const { id } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid folder id" }, { status: 400 });
    }

    await connectDB();

    const editCheck = await checkCanEdit(request, roomId);
    if (editCheck.error) {
      return editCheck.error;
    }

    // Find folder before deleting it
    const folder = await Directory.findById(id).lean();

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 });
    }

    // Delete recursively
    async function deleteFolderRecursively(folderId: mongoose.Types.ObjectId) {
      const childFolders = await Directory.find({
        parentDirId: folderId,
      })
        .select("_id")
        .lean();

      for (const child of childFolders) {
        await deleteFolderRecursively(child._id);
      }

      await File.deleteMany({
        parentDirId: folderId,
      });

      await Directory.findByIdAndDelete(folderId);
    }

    await deleteFolderRecursively(new mongoose.Types.ObjectId(id));

    const cacheKey = `room:${roomId}:parent:${folder.parentDirId ?? "root"}`;

    await deleteCache(cacheKey);

    return NextResponse.json({ message: "folder deleted" }, { status: 200 });
  } catch (err) {
    console.error("Delete folder error:", err);

    return NextResponse.json({ error: "delete failed" }, { status: 500 });
  }
}

/* =========================
   PATCH → Rename Folder
========================= */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await getRoomId(params);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  await connectDB();
  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const { id, name } = await request.json();

    const editCheck = await checkCanEdit(request, roomId);
    if (editCheck.error) {
      return editCheck.error;
    }

    const folder = await Directory.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    const cacheKey = `room:${roomId}:parent:${folder.parentDirId || "root"}`;
    await deleteCache(cacheKey);

    return NextResponse.json(folder);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "rename failed" }, { status: 500 });
  }
}
