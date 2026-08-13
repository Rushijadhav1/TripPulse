import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const getMyTrips = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const trips = await ctx.db
      .query("trips")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return trips;
  },
});

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

    if (trip.userId !== identity.subject) {
      throw new Error("You don't have access to this trip.");
    }

    return trip;
  },
});

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
      throw new Error("You must be logged in.");
    }

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
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return tripId;
  },
});

export const updateTripWithAI = mutation({
  args: {
    tripId: v.id("trips"),
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
            location: v.string(),
            estimatedCost: v.number(),
            category: v.string(),
          }),
        ),
      }),
    ),
    budgetBreakdown: v.object({
      accommodation: v.number(),
      food: v.number(),
      transportation: v.number(),
      activities: v.number(),
      miscellaneous: v.number(),
      total: v.number(),
    }),
    packingList: v.array(
      v.object({
        item: v.string(),
        category: v.string(),
        essential: v.boolean(),
      }),
    ),
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

    await ctx.db.patch(args.tripId, {
      summary: args.summary,
      itinerary: args.itinerary,
      budgetBreakdown: args.budgetBreakdown,
      packingList: args.packingList,
      status: "completed",
      updatedAt: Date.now(),
    });

    return args.tripId;
  },
});

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