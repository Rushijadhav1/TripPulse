export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-dvh w-full">
      <div className="mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
  );
}
