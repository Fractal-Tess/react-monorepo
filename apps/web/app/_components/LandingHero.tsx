import { AtmosphereBackground } from "@workspace/ui/components/atmosphere-background";
import { Badge } from "@workspace/ui/components/badge";
import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type LandingHeroProps = {
  hasConvex: boolean;
};

export function LandingHero({ hasConvex }: LandingHeroProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] border bg-background/72 shadow-[0_30px_100px_-45px_hsl(var(--foreground)/0.38)]">
      <AtmosphereBackground />
      <div className="relative flex h-full min-h-[38rem] flex-col justify-between p-8 md:p-10 lg:p-12">
        <div className="space-y-6">
          <Badge className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.24em]">
            Convex, Turborepo, Tailwind, shadcn/ui starter
          </Badge>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-balance font-semibold text-5xl tracking-tight sm:text-6xl md:text-7xl">
              A minimal starter for apps, auth, workers, and scraping.
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-8 md:text-xl">
              One repo for a Next.js frontend, Convex backend, Bun worker,
              shared UI, and a scraper path with a clean signed-in dashboard.
            </p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(
                buttonVariants({
                  className: "h-11 rounded-full px-6 text-sm",
                })
              )}
              href={hasConvex ? "/login" : "#convex-preview"}
            >
              {hasConvex ? "Open Login" : "See Preview"}
              <ArrowRightIcon className="size-4" />
            </Link>
            <Link
              className={cn(
                buttonVariants({
                  className: "h-11 rounded-full px-6 text-sm",
                  variant: "outline",
                })
              )}
              href="/dashboard"
            >
              View Dashboard
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.5rem] border bg-background/68 p-4 backdrop-blur">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
                Auth
              </p>
              <p className="mt-2 font-medium">Better Auth on Convex</p>
            </div>
            <div className="rounded-[1.5rem] border bg-background/68 p-4 backdrop-blur">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
                Runtime
              </p>
              <p className="mt-2 font-medium">Next.js, Bun, and Convex</p>
            </div>
            <div className="rounded-[1.5rem] border bg-background/68 p-4 backdrop-blur">
              <p className="text-muted-foreground text-xs uppercase tracking-[0.24em]">
                UI
              </p>
              <p className="mt-2 font-medium">Tailwind and shadcn/ui</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
