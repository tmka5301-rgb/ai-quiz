import { error } from "console";
import { Webhook } from "svix";
import { NextRequest, NextResponse } from "next/server";

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
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Headers" }, { status: 400 });
  }
}
