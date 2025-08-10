// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),

    role: v.union(v.literal("student"), v.literal("mentor"), v.literal("admin"), v.literal("none")),
    mentorStatus: v.union(
      v.literal("none"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),

    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),

    mentorIds: v.optional(v.array(v.id("users"))),
    studentIds: v.optional(v.array(v.id("users"))),

    applicationDetails: v.optional(v.object({
        name: v.string(),
        bio: v.string(),
        university: v.string(),
        yearOfStudy: v.number(),
        subjects: v.array(v.string()),
        grades: v.array(v.string()),
        gradesUrl: v.optional(v.string()),
    })),

    studentDetails: v.optional(v.object({
        name: v.string(),
        bio: v.string(),
        university: v.string(),
        subjects: v.array(v.string()),
        grades: v.array(v.string()),
    })),

  }).index("by_clerk_id", ["clerkId"]),
  
  messages: defineTable({
    userId: v.id("users"),
    chatId: v.string(),
    text: v.string(),
    fileUrl: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileType: v.optional(v.string()),
  }).index("by_chatId", ["chatId"]),
});
