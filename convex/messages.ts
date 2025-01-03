import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createMessages = mutation({
  args: {
    message: v.string(),
    author: v.string(),
  },
  async handler(ctx, args) {
    const { message, author } = args;
    await ctx.db.insert("messages", {
      message: message,
      author: author,
    });
  },
});

export const getMessages = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("messages").collect();
  },
});

export const getAuthor = query({
  // Validators for arguments.
  args: {},
  // Query implementation.
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    // return (await ctx.auth.getUserIdentity())?.name ?? null;
    return identity?.name;
  },
});
