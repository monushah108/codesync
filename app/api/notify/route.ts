import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/model/notification";

export async function GET() {
  await connectDB();

  const notifications = await Notification.find()
    .populate("senderId")
    .populate("receiverId")
    .sort({ createdAt: -1 });

  return NextResponse.json(notifications);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const notification = await Notification.create(body);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create notification" },
      { status: 500 },
    );
  }
}
