import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response("Invalid request", { status: 400 });
  }

  const { type, data } = event;

  switch (type) {
    case "user.created": {
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        name: getFullName(data.first_name, data.last_name),
        email: data.email_addresses[0]?.email_address,
      });
      break;
    }

    case "user.updated": {
      await ctx.runMutation(internal.users.updateUser, {
        clerkId: data.id,
        name: getFullName(data.first_name, data.last_name),
      });
      break;
    }

    case "user.deleted": {
      if (data.object === "user" && data.id) {
        await ctx.runMutation(internal.users.deleteUser, {
          clerkId: data.id,
        });
      }
      break;
    }

    default: {
      console.warn("Unhandled Clerk webhook event:", type);
      return new Response("Unhandled event type", { status: 501 });
    }
  }

  return new Response(null, { status: 200 });
});

async function validateRequest(req: Request): Promise<WebhookEvent | undefined> {
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing SVIX headers");
    return undefined;
  }

  const payload = await req.text();

  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  };

  try {
    const wh = new Webhook(webhookSecret);
    const evt = wh.verify(payload, svixHeaders);
    return evt as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return undefined;
  }
}

function getFullName(first?: string | null, last?: string | null): string {
  return [first, last].filter(Boolean).join(" ");
}
