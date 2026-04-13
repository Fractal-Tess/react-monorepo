import { Geist_Mono, Inter } from "next/font/google";

import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { getToken } from "@/lib/auth-server";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const deploymentUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  const token = deploymentUrl ? await getToken() : null;

  return (
    <html
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
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
