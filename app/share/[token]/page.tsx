import SharedTrip from "../[token]/shared-trip";

export default async function SharePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <SharedTrip token={token} />;
}