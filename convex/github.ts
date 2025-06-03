"use node";

import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const syncToGitHub = action({
  args: {
    messageId: v.id("contactMessages"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.runQuery(internal.messages.getMessage, {
      messageId: args.messageId,
    });
    
    if (!message) {
      throw new Error("Message not found");
    }

    const token = "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";
    const repo = "Working-aanas/extensionmaker.github.io";
    const branch = "main";
    
    // Create file content
    const timestamp = new Date(message.submittedAt).toISOString();
    const filename = `message-${timestamp.replace(/[:.]/g, "-")}.md`;
    const content = `# Contact Form Submission

**Date:** ${new Date(message.submittedAt).toLocaleString()}
**Name:** ${message.name}
**Email:** ${message.email}
**Project Type:** ${message.projectType}
**Budget:** ${message.budget || "Not specified"}

## Description:
${message.description}

---
*Submitted via portfolio website*
`;

    try {
      // Create file in GitHub repo
      const response = await fetch(`https://api.github.com/repos/${repo}/contents/messages/${filename}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json",
        },
        body: JSON.stringify({
          message: `New contact form submission from ${message.name}`,
          content: Buffer.from(content).toString("base64"),
          branch: branch,
        }),
      });

      if (response.ok) {
        await ctx.runMutation(internal.messages.markAsSynced, {
          messageId: args.messageId,
        });
      } else {
        const error = await response.text();
        console.error("GitHub API error:", error);
        throw new Error(`GitHub sync failed: ${error}`);
      }
    } catch (error) {
      console.error("Error syncing to GitHub:", error);
      throw error;
    }
  },
});




