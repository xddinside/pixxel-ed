import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    email: v.optional(v.string()),

    role: v.union(v.literal("student"), v.literal("mentor"), v.literal("admin")),
    mentorStatus: v.union(
      v.literal("none"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),

    bio: v.optional(v.string()),
    subjects: v.optional(v.array(v.string())),

    applicationDetails: v.optional(v.object({
        university: v.string(),
        yearOfStudy: v.number(),
        gradesUrl: v.optional(v.string()),
    })),

  }).index("by_clerk_id", ["clerkId"]),
});
