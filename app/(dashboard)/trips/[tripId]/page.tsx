import { isAuthenticated } from "@/lib/auth-server";
import { redirect } from "next/navigation";

import TripDetails from "./trip-details";

export default async function TripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/sign-in");
  }

  const { tripId } = await params;

  return <TripDetails tripId={tripId} />;
}