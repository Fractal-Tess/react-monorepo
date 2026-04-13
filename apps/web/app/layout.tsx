import { Geist_Mono, Roboto } from "next/font/google";

import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { env } from "@/env";
import { ThemeProvider } from "@/components/theme-provider";
import { getToken } from "@/lib/auth-server";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const deploymentUrl = env.CONVEX_URL;
  let token: string | null = null;

  try {
    token = await getToken();
  } catch {
    token = null;
  }

  return (
    <html
      className={cn(
        "antialiased",
        fontMono.variable,
        roboto.variable,
        "font-sans"
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>
          <ConvexClientProvider
            deploymentUrl={deploymentUrl}
            initialToken={token}
          >
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
