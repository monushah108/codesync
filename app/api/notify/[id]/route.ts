import { connectDB } from "@/lib/db";
import { getUserId } from "@/lib/getUserId";
import Member from "@/model/member";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const senderId = await getUserId(req);
  const { action, isRead, message } = await req.json();

  // Find the original request
  const request = await Notification.findById(id);

  if (!request) {
    return NextResponse.json({ message: "Request not found" }, { status: 404 });
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

  if (action == "readed") {
    await Notification.findByIdAndUpdate(id, { isRead }, { new: true });
  }

  if (action == "ban") {
    await Notification.findByIdAndUpdate(
      id,
      { isRead, message },
      { new: true },
    );
    await Member.findByIdAndUpdate(
      request.receiverId,
      { banned: true },
      { new: true },
    );
  }

  if (action == "system") {
    await Notification.create({
      receiverId: senderId,
      senderId: request.roomId,
      type: "system",
      message,
    });
  }

  if (["member_join", "member_leave"].includes(action)) {
    await Notification.create({
      type: "system",
      receiverId: senderId,
      message,
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
