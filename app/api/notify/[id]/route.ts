import { connectDB } from "@/lib/db";
import Notification from "@/model/notification";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;

  const notification = await Notification.findById(id);

  if (!notification)
    return NextResponse.json({ message: "Not found" }, { status: 404 });

  return NextResponse.json(notification);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const body = await req.json();
  const { id } = await params;

  const notification = await Notification.findByIdAndUpdate(id, body, {
    new: true,
  });

  return NextResponse.json(notification);
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
