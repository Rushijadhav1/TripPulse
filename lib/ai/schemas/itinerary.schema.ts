import { z } from "zod";

export const itineraryActivitySchema = z.object({
  time: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  estimatedCost: z.number().nonnegative(),
  category: z.string(),
});

export const itineraryDaySchema = z.object({
  day: z.number().positive(),
  date: z.string(),
  title: z.string(),
  activities: z.array(itineraryActivitySchema),
});

export const packingItemSchema = z.object({
  item: z.string(),
  category: z.string(),
  essential: z.boolean(),
});

export const budgetBreakdownSchema = z.object({
  accommodation: z.number().nonnegative(),
  food: z.number().nonnegative(),
  transportation: z.number().nonnegative(),
  activities: z.number().nonnegative(),
  miscellaneous: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const itinerarySchema = z.object({
  summary: z.string(),
  itinerary: z.array(itineraryDaySchema),
  budgetBreakdown: budgetBreakdownSchema,
  packingList: z.array(packingItemSchema),
});

export type Itinerary = z.infer<typeof itinerarySchema>;