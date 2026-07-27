import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Notification from "@/model/notification";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const senderId = await getUserId(req);
  const { action } = await req.json();

  // Find the original request
  const request = await Notification.findById(id);

  if (!request) {
    return NextResponse.json({ message: "Request not found" }, { status: 404 });
  }

  if (!request.receiverId.equals(senderId)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  if (["accepted", "decline"].includes(action)) {
    // Delete the original notification
    await Notification.findByIdAndDelete(id);

    // Create a response notification for the sender
    await Notification.create({
      senderId: request.receiverId, // Current user
      receiverId: request.senderId, // Original sender
      roomId: request.roomId,
      type: request.type,
      action,
      message:
        action === "accepted"
          ? "Your collaboration request has been accepted."
          : "Your collaboration request has been declined.",
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      message: `Request ${action}.`,
    });
  }

  if (action == "read") {
    await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
    return NextResponse.json({
      success: true,
    });
  }
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
