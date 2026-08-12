import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new trip
export const createTrip = mutation({
  args: {
    title: v.string(),
    destination: v.string(),
    country: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    travelers: v.number(),
    budget: v.number(),
    currency: v.string(),
    travelStyle: v.array(v.string()),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be logged in to create a trip.");
    }

    const now = Date.now();

    const tripId = await ctx.db.insert("trips", {
      userId: identity.subject,

      title: args.title,
      destination: args.destination,
      country: args.country,

      startDate: args.startDate,
      endDate: args.endDate,

      travelers: args.travelers,
      budget: args.budget,
      currency: args.currency,

      travelStyle: args.travelStyle,

      // Temporary values.
      // AI will fill these later.
      summary: "",

      itinerary: [],

      budgetBreakdown: {
        accommodation: 0,
        food: 0,
        transportation: 0,
        activities: 0,
        miscellaneous: 0,
        total: 0,
      },

      packingList: [],

      status: "planning",

      createdAt: now,
      updatedAt: now,
    });

    return tripId;
  },
});

// Get all trips belonging to the current user
export const getMyTrips = query({
  args: {},

  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    return await ctx.db
      .query("trips")
      .withIndex("by_user", (q) =>
        q.eq("userId", identity.subject),
      )
      .order("desc")
      .collect();
  },
});

// Get one trip
export const getTrip = query({
  args: {
    tripId: v.id("trips"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be logged in.");
    }

    const trip = await ctx.db.get(args.tripId);

    if (!trip) {
      return null;
    }

    // Important security check
    if (trip.userId !== identity.subject) {
      throw new Error("You don't have access to this trip.");
    }

    return trip;
  },
});

// Delete a trip
export const deleteTrip = mutation({
  args: {
    tripId: v.id("trips"),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("You must be logged in.");
    }

    const trip = await ctx.db.get(args.tripId);

    if (!trip) {
      throw new Error("Trip not found.");
    }

    if (trip.userId !== identity.subject) {
      throw new Error("You don't have access to this trip.");
    }

    await ctx.db.delete(args.tripId);

    return {
      success: true,
    };
  },
});