import TripDetails from "./trip-details";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function TripPage({
  params,
}: TripPageProps) {
  const { tripId } = await params;

  return <TripDetails tripId={tripId} />;
}