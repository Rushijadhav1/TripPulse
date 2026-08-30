import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { AuthClient } from "@convex-dev/better-auth/react";

export const authClient = createAuthClient({
  plugins: [convexClient()],
}) as unknown as AuthClient;

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: number;
  updatedAt: number;
  [key: string]: unknown;
};

export type AuthSession = {
  session: {
    id: string;
    userId: string;
    expiresAt: number;
    createdAt: number;
    updatedAt: number;
    [key: string]: unknown;
  };
  user: AuthUser;
};

export function useAuthSession() {
  const { data, isPending, isRefetching, error, refetch } =
    authClient.useSession();

  return {
    data: data as AuthSession | null,
    isPending,
    isRefetching,
    error,
    refetch,
  };
}
