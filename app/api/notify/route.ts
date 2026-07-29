import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Notification from "@/model/notification";

import { getUserId } from "@/lib/getUserId";

export async function GET(req: NextRequest) {
  await connectDB();
  const receiverId = await getUserId(req);

  const notifications = await Notification.find({ receiverId }).sort({
    createdAt: -1,
  });

  return NextResponse.json(notifications, { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const userId = await getUserId(req);
    const body = await req.json();
    const alreadySent = await Notification.hasPending({
      senderId: userId,
      receiverId: body.receiverId,
      type: body.type,
    });

    if (alreadySent) {
      return NextResponse.json(
        {
          message: "Request already sent.",
        },
        { status: 409 },
      );
    }

    const hasRequestAccepted = await Notification.findOne({
      receiverId: userId,
      type: "request",
      action: "accepted",
    });

    if (hasRequestAccepted) {
      return NextResponse.json(
        {
          accepted: true,
          message: "your request is accepted go to dashboard for joining ",
        },
        { status: 201 },
      );
    }

    const notification = await Notification.create({
      ...body,
      senderId: userId,
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create notification" },
      { status: 500 },
    );
  }
}
