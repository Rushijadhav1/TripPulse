import { createApi } from "@convex-dev/better-auth";
import schema from "./schema";

// Minimal options placeholder - the real auth options are passed at runtime
const getOptions = () => ({
  database: {},
  baseURL: process.env.SITE_URL,
  secret: process.env.BETTER_AUTH_SECRET,
});

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = createApi(schema, getOptions);
