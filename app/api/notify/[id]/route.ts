import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Notification from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const currentUserId = await getUserId(req);
  const { action } = await req.json();

  const request = await Notification.findById(id);

  if (!request) {
    return NextResponse.json({ message: "Request not found" }, { status: 404 });
  }

  // Only the notification receiver (room admin) can accept/decline.
  if (request.receiverId.toString() !== currentUserId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  if (action === "read") {
    await Notification.findOneAndUpdate(
      {
        _id: id,
        receiverId: currentUserId,
      },
      {
        $set: {
          readAt: new Date(),
        },
      },
      {
        new: true,
      },
    );

    return NextResponse.json({
      success: true,
      action: "read",
    });
  }

  if (action === "accepted") {
    // The original sender is the person who requested access.
    const requesterId = request.senderId;
    const roomId = request.roomId;

    // Avoid duplicate membership
    await Member.updateOne(
      {
        userId: requesterId,
        roomId,
      },
      {
        $setOnInsert: {
          userId: requesterId,
          roomId,
        },
      },
      { upsert: true },
    );

    // Delete the request notification
    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      action: "accepted",
      roomId,
      receiverId: requesterId,
      message: "Request accepted.",
    });
  }

  if (action === "declined") {
    await Notification.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      action: "declined",
      receiverId: request.senderId,
      message: "Request declined.",
    });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;

  await Notification.findByIdAndDelete(id);

  return NextResponse.json({
    message: "Notification deleted",
  });
}
