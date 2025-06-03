import { mutation, query, internalQuery, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const submitContactForm = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    projectType: v.string(),
    description: v.string(),
    budget: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("contactMessages", {
      ...args,
      submittedAt: Date.now(),
      githubSynced: false,
    });
    
    // Schedule GitHub sync
    await ctx.scheduler.runAfter(0, "github:syncToGitHub" as any, {
      messageId,
    });
    
    return messageId;
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contactMessages").order("desc").collect();
  },
});

export const getMessage = internalQuery({
  args: {
    messageId: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.messageId);
  },
});

export const markAsSynced = internalMutation({
  args: {
    messageId: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, {
      githubSynced: true,
    });
  },
});
