import "./globals.css";

import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken();

  return (
    <html lang="en">
      <body>
        <ConvexClientProvider initialToken={token}>
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}