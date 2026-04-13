import { redirect } from "next/navigation";

import { getToken } from "@/lib/auth-server";

import { LoginArtPanel } from "./_components/LoginArtPanel";
import { LoginCard } from "./_components/LoginCard.client";

export default async function Page() {
  const token = await getToken();

  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(0,1.1fr)_minmax(24rem,32rem)]">
      <LoginArtPanel />
      <section className="relative flex items-center justify-center overflow-hidden bg-background px-6 py-10 md:px-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </section>
    </main>
  );
}
