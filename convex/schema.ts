import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  trips: defineTable({
    userId: v.string(),

    // Basic trip information
    title: v.string(),
    destination: v.string(),
    country: v.optional(v.string()),

    // Dates
    startDate: v.string(),
    endDate: v.string(),

    // Travelers & budget
    travelers: v.number(),
    budget: v.number(),
    currency: v.string(),

    // Preferences
    travelStyle: v.array(v.string()),

    // AI-generated content
    summary: v.string(),

    itinerary: v.array(
      v.object({
        day: v.number(),
        date: v.string(),
        title: v.string(),

        activities: v.array(
          v.object({
            time: v.string(),
            title: v.string(),
            description: v.string(),
            location: v.optional(v.string()),
            estimatedCost: v.number(),
            category: v.string(),
          }),
        ),
      }),
    ),

    // Budget breakdown
    budgetBreakdown: v.object({
      accommodation: v.number(),
      food: v.number(),
      transportation: v.number(),
      activities: v.number(),
      miscellaneous: v.number(),
      total: v.number(),
    }),

    // Packing checklist
    packingList: v.array(
      v.object({
        item: v.string(),
        category: v.string(),
        essential: v.boolean(),
      }),
    ),

    // Status
    status: v.union(
      v.literal("planning"),
      v.literal("completed"),
      v.literal("archived"),
    ),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_destination", ["destination"]),
});