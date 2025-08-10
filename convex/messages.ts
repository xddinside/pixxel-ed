// convex/messages.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const list = query({
  args: { chatId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .order("asc")
      .collect();

    return Promise.all(
      messages.map(async (message) => {
        const user = await ctx.db.get(message.userId);
        return {
          ...message,
          author: user?.name,
          clerkId: user?.clerkId,
        };
      })
    );
  },
});

export const send = mutation({
  args: {
    chatId: v.string(),
    text: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called send message without authentication.");
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.insert("messages", {
      userId: user._id,
      chatId: args.chatId,
      text: args.text ?? "",
      fileUrl: args.fileUrl,
      fileName: args.fileName,
      fileType: args.fileType,
    });
  },
});
