import { Webhook } from "svix";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type Event = {
  type: string;
  data: {
    id: string;
    first_name: string;
    last_name: string;
    email_addresses: { email_address: string }[];
  };
};

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_KEY;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook secret" },
      { status: 400 },
    );
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-Signature");

  if (!svixId || !svixSignature || !svixTimestamp) {
    return NextResponse.json({ error: "missing headers" }, { status: 400 });
  }

  const webhook = new Webhook(webhookSecret);

  const body = await request.text();

  try {
    const event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as Event;
    if (event.type !== "user.created") {
      return NextResponse.json({ error: "Ignore event" }, { status: 400 });
    }
    const { email_addresses, first_name, last_name, id } = event.data;

    await prisma.user.create({
      data: {
        email: email_addresses[0].email_address,
        userName: `${first_name} ${last_name}`,
        clerkId: id,
      },
    });
    return NextResponse.json({ message: "Success" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: `Invalid signatue ${error}`,
      },
      { status: 500 },
    );
  }
}
