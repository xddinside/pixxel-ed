import { Doc } from "./_generated/dataModel";
import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to create a new user (triggered by Clerk webhook)
export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      console.log(`User with clerkId ${args.clerkId} already exists, skipping creation.`);
      return;
    }

    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email ?? undefined,
      role: "none",
      mentorStatus: "none",
    });
  },
});

export const getUsersByIds = query({
  args: {
    userIds: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const users = await Promise.all(
      args.userIds.map((userId) => ctx.db.get(userId))
    );
    
    return users.filter((user): user is Doc<"users"> => user !== null);
  },
});

export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// Mutation to update user's role from the role selection page
export const updateUserRole = mutation({
  args: {
    role: v.union(v.literal("student"), v.literal("mentor")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to select a role.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    // Only allow updating role if it's currently 'none'
    if (user.role !== "none") {
      console.log(`User ${user.name} already has a role: ${user.role}. Role update skipped.`);
      return;
    }

    await ctx.db.patch(user._id, {
      role: args.role,
    });
  },
});


// Mutation for a user to apply to become a mentor
export const applyToBeMentor = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    university: v.string(),
    yearOfStudy: v.number(),
    subjects: v.array(v.string()),
    grades: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to apply.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      mentorStatus: "pending",
      applicationDetails: {
        name: args.name,
        bio: args.bio,
        university: args.university,
        yearOfStudy: args.yearOfStudy,
        subjects: args.subjects,
        grades: args.grades,
      },
    });
  },
});

// Admin-only query to get all users with a pending mentor application
export const getPendingMentors = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (currentUser?.role !== "admin") {
      console.warn("Non-admin user attempted to access pending mentors");
      return [];
    }

    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("mentorStatus"), "pending"))
      .collect();
  },
});

export const getApprovedMentors = query({
  handler: async (ctx) => {
    const mentors = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("mentorStatus"), "approved"))
      .collect();
    return mentors;
  },
});

// Admin-only mutation to approve a mentor application
export const approveMentor = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Not authenticated");
  
      const adminUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .unique();
  
      if (!adminUser || adminUser.role !== "admin") {
        throw new Error("You are not authorized to perform this action.");
      }
  
      const userToApprove = await ctx.db.get(args.userId);
      if (!userToApprove) {
        throw new Error("User to approve not found.");
      }
  
      await ctx.db.patch(args.userId, {
        name: userToApprove.applicationDetails?.name,
        role: "mentor",
        mentorStatus: "approved",
        subjects: userToApprove.applicationDetails?.subjects,
        bio: userToApprove.applicationDetails?.bio,
      });
    },
  });

// Admin-only mutation to reject a mentor application
export const rejectMentor = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const adminUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!adminUser || adminUser.role !== "admin") {
      throw new Error("You are not authorized to perform this action.");
    }

    await ctx.db.patch(args.userId, {
      mentorStatus: "rejected",
    });
  },
});

// Internal mutation to update a user’s name (from Clerk webhook)
export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return;

    await ctx.db.patch(user._id, {
      name: args.name,
    });
  },
});

// Internal mutation to delete a user (from Clerk webhook)
export const deleteUser = internalMutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) return;

    await ctx.db.delete(user._id);
  },
});

export const connectToMentor = mutation({
  args: {
    mentorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to connect with a mentor.");
    }
    const student = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!student || student.role !== "student") {
      throw new Error("Only students can connect with mentors.");
    }

    const mentor = await ctx.db.get(args.mentorId);
    if (!mentor || mentor.role !== "mentor") {
      throw new Error("This user is not a valid mentor.");
    }

    const existingMentorIds = student.mentorIds ?? [];
    if (!existingMentorIds.includes(args.mentorId)) {
      await ctx.db.patch(student._id, {
        mentorIds: [...existingMentorIds, args.mentorId],
      });
    }

    const existingStudentIds = mentor.studentIds ?? [];
    if (!existingStudentIds.includes(student._id)) {
      await ctx.db.patch(mentor._id, {
        studentIds: [...existingStudentIds, student._id],
      });
    }
  },
});

export const updateStudentDetails = mutation({
  args: {
    name: v.string(),
    bio: v.string(),
    university: v.string(),
    subjects: v.array(v.string()),
    grades: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("You must be logged in to update your details.");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found.");
    }

    await ctx.db.patch(user._id, {
      name: args.name,
      studentDetails: {
        name: args.name,
        bio: args.bio,
        university: args.university,
        subjects: args.subjects,
        grades: args.grades,
      },
    });
  },
});
