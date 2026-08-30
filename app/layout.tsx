import "./globals.css";

import { getToken } from "@/lib/auth-server";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuroraBackground } from "@/components/providers/aurora-background";
import { Toaster } from "@/components/ui/sonner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getToken().catch(() => null);

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ConvexClientProvider initialToken={token}>
            <AuroraBackground>{children}</AuroraBackground>
          </ConvexClientProvider>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}