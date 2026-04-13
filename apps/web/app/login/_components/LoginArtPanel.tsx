import { Badge } from "@workspace/ui/components/badge";
import { Grid2X2Icon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

export function LoginArtPanel() {
  return (
    <section className="relative hidden overflow-hidden border-r bg-[#0e1726] text-white lg:flex">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40" />
      <div className="absolute top-[-15%] left-[-10%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="absolute right-[-5%] bottom-[-10%] h-[28rem] w-[28rem] rounded-full bg-amber-300/20 blur-3xl" />
      <div className="relative z-10 flex min-h-svh flex-col justify-between p-10">
        <div className="flex items-center justify-between">
          <Link className="font-medium text-white/90 tracking-wide" href="/">
            React Monorepo
          </Link>
          <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
            Better Auth + Convex
          </Badge>
        </div>
        <div className="max-w-xl space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-white/60 uppercase tracking-[0.3em]">
              Secure Entry
            </p>
            <h1 className="font-semibold text-5xl leading-tight tracking-tight">
              Sign in to the dashboard with the same auth system your Convex
              backend already trusts.
            </h1>
          </div>
          <div className="grid gap-3 text-sm text-white/75">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <ShieldCheckIcon className="mt-0.5 size-4 text-cyan-300" />
              Convex handles the auth tables and token handoff.
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <Grid2X2Icon className="mt-0.5 size-4 text-cyan-300" />
              The frontend keeps the public landing page and signed-in dashboard
              cleanly separated.
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
              <SparklesIcon className="mt-0.5 size-4 text-cyan-300" />
              This page keeps the `login-02` block structure, but with real
              Better Auth actions instead of placeholders.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
