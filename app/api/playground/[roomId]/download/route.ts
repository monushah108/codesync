import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Room from "@/model/room";
import Directory from "@/model/directory";
import File from "@/model/file";
import { Member } from "@/model/member";
import { getUserId } from "@/lib/getUserId";
import { consumeToken } from "@/lib/rateLimiter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { success } = consumeToken(request);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { roomId } = await params;
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
    }

    const userId = await getUserId(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const room = await Room.findById(roomId).lean();
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    // Verify user authorization for this room
    const isOwner = room.adminId?.toString() === userId.toString();
    const member = await Member.findOne({ userId, roomId }).lean();

    if (member && member.banned) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (!isOwner && !member) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const folderId = request.nextUrl.searchParams.get("folderId");
    if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
      return NextResponse.json({ error: "Invalid folder id" }, { status: 400 });
    }

    // Fetch all directories and files for this room
    const [directories, files] = await Promise.all([
      Directory.find({ roomId }).lean(),
      File.find({ roomId }).lean(),
    ]);

    let targetDirName = room.name || "project";
    if (folderId) {
      const targetDir = directories.find((d) => d._id.toString() === folderId);
      if (!targetDir) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 });
      }
      targetDirName = targetDir.name;
    }

    const safeFilename =
      targetDirName.trim().replace(/[^a-zA-Z0-9_\-\.]/g, "_") || "project";

    const zip = new JSZip();
    const dirMap = new Map(directories.map((d) => [d._id.toString(), d]));
    const rootDirIdStr = room.rootDirId ? room.rootDirId.toString() : null;
    const targetDirId = folderId || rootDirIdStr;

    function getRelativePath(
      dirId: string | null,
      visited = new Set<string>()
    ): string | null {
      if (!dirId) {
        return targetDirId ? (targetDirId === rootDirIdStr ? "" : null) : "";
      }
      if (targetDirId && dirId === targetDirId) {
        return "";
      }
      if (rootDirIdStr && dirId === rootDirIdStr && !folderId) {
        return "";
      }
      if (visited.has(dirId)) {
        return null; // loop protection
      }
      visited.add(dirId);

      const dir = dirMap.get(dirId);
      if (!dir) return null;

      const parentId = dir.parentDirId ? dir.parentDirId.toString() : null;
      const parentPath = getRelativePath(parentId, visited);
      if (parentPath === null) return null;

      return parentPath ? `${parentPath}/${dir.name}` : dir.name;
    }

    // Preserve directory structure including empty directories
    for (const dir of directories) {
      const relPath = getRelativePath(dir._id.toString());
      if (relPath) {
        zip.folder(relPath);
      }
    }

    // Add files to zip
    for (const file of files) {
      const parentDirId = file.parentDirId ? file.parentDirId.toString() : null;
      const dirPath = getRelativePath(parentDirId);
      if (dirPath === null) {
        continue;
      }
      const filePath = dirPath ? `${dirPath}/${file.name}` : file.name;
      zip.file(filePath, file.content ?? "");
    }

    const zipData = await zip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    return new Response(zipData as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${safeFilename}.zip"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error creating project zip:", error);
    return NextResponse.json(
      { error: "Failed to download project" },
      { status: 500 }
    );
  }
}
