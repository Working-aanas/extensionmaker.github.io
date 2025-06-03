import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    projectType: v.string(), // "browser-extension" or "automated-bot"
    description: v.string(),
    budget: v.optional(v.string()),
    submittedAt: v.number(),
    githubSynced: v.optional(v.boolean()),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
