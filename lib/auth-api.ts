import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

export async function requireAuth(): Promise<
  { authenticated: true } | { authenticated: false; response: NextResponse }
> {
  const authed = await isAuthenticated();

  if (!authed) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 },
      ),
    };
  }

  return { authenticated: true };
}
