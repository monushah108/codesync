import { connectDB } from "@/lib/db";
import { consumeToken } from "@/lib/rateLimiter";
import Directory from "@/model/directory";
import File from "@/model/file";
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

/* =========================
   GET → Lazy Load Folders
========================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  await connectDB();

  const roomId = await getRoomId(params);
  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  const parentId = request.nextUrl.searchParams.get("parentId");

  const { success } = consumeToken(request);

  if (!success) {
    return Response.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const room = await Room.findById(roomId).select("rootDirId").lean();

    if (!room) {
      return Response.json({ error: "Room not found" }, { status: 404 });
    }

    const folderId = parentId ?? room.rootDirId;

    /*
     * Get current folder + children in parallel.
     */
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
      return Response.json({ error: "Folder not found" }, { status: 404 });
    }

    return Response.json(
      {
        parentId: folderId,
        rootFolder,
        folders,
        files,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("Failed to fetch folders:", err);

    return Response.json({ error: "Failed to fetch folders" }, { status: 500 });
  }
}

/* =========================
   POST → Create Folder
========================= */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  await connectDB();
  const roomId = await getRoomId(params);

  const { success } = consumeToken(request);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }
  if (!success) {
    return Response.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name) {
      return Response.json({ error: "name required" }, { status: 400 });
    }

    const folder = await Directory.create({
      name,
      parentDirId: parentId || null,
      roomId,
    });

    return Response.json(folder, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "failed to create folder" }, { status: 500 });
  }
}

/* =========================
   DELETE Folder
========================= */

export async function DELETE(request: NextRequest) {
  await connectDB();

  const { success } = consumeToken(request);

  if (!success) {
    return Response.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const { id } = await request.json();

    async function deleteFolderRecursively(folderId: mongoose.Types.ObjectId) {
      // Find immediate child folders
      const childFolders = await Directory.find({
        parentDirId: folderId,
      });

      // Delete descendants first
      for (const child of childFolders) {
        await deleteFolderRecursively(child._id);
      }

      // Delete files inside this folder
      await File.deleteMany({
        parentDirId: folderId,
      });

      // Delete the folder itself
      await Directory.findByIdAndDelete(folderId);
    }

    await deleteFolderRecursively(new mongoose.Types.ObjectId(id));

    return Response.json({ message: "folder deleted" }, { status: 200 });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "delete failed" }, { status: 500 });
  }
}

/* =========================
   PATCH → Rename Folder
========================= */

export async function PATCH(request: NextRequest) {
  await connectDB();
  const { success } = consumeToken(request);

  if (!success) {
    return Response.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  try {
    const { id, name } = await request.json();

    const folder = await Directory.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    return Response.json(folder);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "rename failed" }, { status: 500 });
  }
}
