import { consumeToken } from "@/lib/rateLimiter";
import File from "@/model/file";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

/* =========================
   CONSTANTS
========================= */

const MAX_FILE_NAME_LENGTH = 255;
const MAX_FILE_CONTENT_LENGTH = 500_000; // ~500 KB

/* =========================
   HELPERS
========================= */

function isValidObjectId(id: unknown): id is string {
  return typeof id === "string" && mongoose.Types.ObjectId.isValid(id);
}

function isValidFileName(name: unknown): name is string {
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.length <= MAX_FILE_NAME_LENGTH
  );
}

function isValidContent(content: unknown): content is string {
  return (
    typeof content === "string" && content.length <= MAX_FILE_CONTENT_LENGTH
  );
}

async function getRoomId(params: Promise<{ roomId: string }>) {
  const { roomId } = await params;

  if (!isValidObjectId(roomId)) {
    return null;
  }

  return roomId;
}

function rateLimit(request: NextRequest) {
  const { success } = consumeToken(request);

  if (!success) {
    return NextResponse.json({ error: "rate limit exceeded" }, { status: 429 });
  }

  return null;
}

/* =========================
   GET → Fetch File(s)
========================= */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const limited = rateLimit(request);

  if (limited) {
    return limited;
  }

  const fileId = request.nextUrl.searchParams.get("fileId");

  if (fileId) {
    if (!isValidObjectId(fileId)) {
      return NextResponse.json({ error: "Invalid file id" }, { status: 400 });
    }

    try {
      await connectDB();
      const file = await File.findById(fileId).lean();

      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }

      return NextResponse.json(file);
    } catch (err) {
      console.error("GET file error:", err);

      return NextResponse.json(
        { error: "failed to fetch file" },
        { status: 500 },
      );
    }
  }

  const roomId = await getRoomId(params);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  try {
    await connectDB();
    const files = await File.find({ roomId })
      .select("_id name parentDirId createdAt")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(files);
  } catch (err) {
    console.error("GET all files error:", err);

    return NextResponse.json(
      { error: "failed to fetch files" },
      { status: 500 },
    );
  }
}

/* =========================
   POST → Create File
========================= */

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  const roomId = await getRoomId(params);

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room id" }, { status: 400 });
  }

  const limited = rateLimit(request);

  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();

    const name = body?.name;
    const parentId = body?.parentId;

    /* ---------- Validate name ---------- */

    if (!isValidFileName(name)) {
      return NextResponse.json(
        {
          error: "Invalid file name",
        },
        { status: 400 },
      );
    }

    /* ---------- Validate parentId ---------- */

    if (parentId !== undefined && parentId !== null) {
      if (!isValidObjectId(parentId)) {
        return NextResponse.json(
          {
            error: "Invalid parent id",
          },
          { status: 400 },
        );
      }
    }

    /* ---------- Create ---------- */

    const file = await File.create({
      name: name.trim(),
      parentDirId: parentId || null,
      roomId,
      content: "",
    });

    return NextResponse.json(file, {
      status: 201,
    });
  } catch (err) {
    console.error("POST file error:", err);

    return NextResponse.json(
      { error: "file creation failed" },
      { status: 500 },
    );
  }
}

/* =========================
   DELETE → Delete File
========================= */

export async function DELETE(request: NextRequest) {
  const limited = rateLimit(request);

  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();

    const id = body?.id;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: "Invalid file id",
        },
        { status: 400 },
      );
    }

    const file = await File.findById(id);

    if (!file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 },
      );
    }

    await File.findByIdAndDelete(id);

    return NextResponse.json({
      message: "file deleted",
    });
  } catch (err) {
    console.error("DELETE file error:", err);

    return NextResponse.json(
      {
        error: "delete failed",
      },
      { status: 500 },
    );
  }
}

/* =========================
   PATCH → Rename File
========================= */

export async function PATCH(request: NextRequest) {
  const limited = rateLimit(request);

  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();

    const id = body?.id;
    const name = body?.name;

    /* ---------- Validate ID ---------- */

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: "Invalid file id",
        },
        { status: 400 },
      );
    }

    /* ---------- Validate name ---------- */

    if (!isValidFileName(name)) {
      return NextResponse.json(
        {
          error: "Invalid file name",
        },
        { status: 400 },
      );
    }

    /* ---------- Update ---------- */

    const file = await File.findByIdAndUpdate(id, { name }, { new: true });

    if (!file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(file);
  } catch (err) {
    console.error("PATCH file error:", err);

    return NextResponse.json(
      {
        error: "rename failed",
      },
      { status: 500 },
    );
  }
}

/* =========================
   PUT → Update File Content
========================= */

export async function PUT(request: NextRequest) {
  const limited = rateLimit(request);

  if (limited) {
    return limited;
  }

  try {
    const body = await request.json();

    const id = body?.id;
    const content = body?.content;

    /* ---------- Validate ID ---------- */

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          error: "Invalid file id",
        },
        { status: 400 },
      );
    }

    /* ---------- Validate content ---------- */

    if (!isValidContent(content)) {
      return NextResponse.json(
        {
          error: `Content must be a string and cannot exceed ${MAX_FILE_CONTENT_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    /* ---------- Update ---------- */

    const file = await File.findByIdAndUpdate(id, { content });

    if (!file) {
      return NextResponse.json(
        {
          error: "File not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(file);
  } catch (err) {
    console.error("PUT file error:", err);

    return NextResponse.json(
      {
        error: "update failed",
      },
      { status: 500 },
    );
  }
}
