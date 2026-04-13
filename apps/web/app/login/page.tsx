import { redirect } from "next/navigation";

import { getToken } from "@/lib/auth-server";

import { LoginArtPanel } from "./_components/LoginArtPanel";
import { LoginCard } from "./_components/LoginCard.client";

export default async function Page() {
  let token: string | null = null;

  try {
    token = await getToken();
  } catch {
    token = null;
  }

  if (token) {
    redirect("/dashboard");
  }

  return (
    <main className="grid min-h-svh lg:grid-cols-[minmax(24rem,32rem)_minmax(0,1.1fr)]">
      <section className="relative flex items-center justify-center bg-background px-6 py-12 md:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <div className="w-full max-w-md">
          <LoginCard />
        </div>
      </section>
      <LoginArtPanel />
    </main>
  );
}
