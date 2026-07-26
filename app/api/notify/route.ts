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

    const alreadySent = await Notification.hasPendingInvitation(
      userId,
      body?.roomId,
    );

    if (alreadySent) {
      return NextResponse.json(
        {
          message: "Request already sent.",
        },
        { status: 409 },
      );
    }

    const notification = await Notification.create(body);

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to create notification" },
      { status: 500 },
    );
  }
}
