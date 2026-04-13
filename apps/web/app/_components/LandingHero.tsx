import { buttonVariants } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  ArrowRightIcon,
  LayersIcon,
  PaletteIcon,
  ShieldCheckIcon,
} from "lucide-react";
import Link from "next/link";

type LandingHeroProps = {
  hasConvex: boolean;
};

const FEATURES = [
  {
    icon: ShieldCheckIcon,
    label: "Auth",
    description: "Better Auth on Convex",
    iconClass: "text-teal-600 dark:text-teal-400",
    bgClass: "bg-teal-500/10 dark:bg-teal-400/10",
  },
  {
    icon: LayersIcon,
    label: "Runtime",
    description: "Next.js, Bun & Convex",
    iconClass: "text-sky-600 dark:text-sky-400",
    bgClass: "bg-sky-500/10 dark:bg-sky-400/10",
  },
  {
    icon: PaletteIcon,
    label: "UI",
    description: "Tailwind & shadcn/ui",
    iconClass: "text-violet-600 dark:text-violet-400",
    bgClass: "bg-violet-500/10 dark:bg-violet-400/10",
  },
] as const;

export function LandingHero({ hasConvex }: LandingHeroProps) {
  return (
    <div className="flex flex-col gap-10 lg:gap-14">
      <div className="flex flex-col gap-6">
        <p className="animate-fade-up text-muted-foreground text-xs uppercase tracking-[0.35em]">
          Convex &middot; Turborepo &middot; Tailwind &middot; shadcn/ui
        </p>
        <h1 className="max-w-4xl animate-fade-up font-heading text-[clamp(2.5rem,6vw,5.5rem)] leading-[1.06] tracking-tight [animation-delay:80ms]">
          A minimal starter for apps, auth, workers &amp; scraping.
        </h1>
        <p className="max-w-xl animate-fade-up text-lg text-muted-foreground leading-relaxed [animation-delay:160ms] md:text-xl">
          One repo for a Next.js frontend, Convex backend, Bun worker, shared
          UI, and a scraper path with a clean signed-in dashboard.
        </p>
      </div>

      <div className="flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row sm:items-center">
        <Link
          className={cn(
            buttonVariants({
              className: "h-12 rounded-full px-8 text-sm",
            })
          )}
          href={hasConvex ? "/login" : "#convex-preview"}
        >
          {hasConvex ? "Get Started" : "See Preview"}
          <ArrowRightIcon className="ml-1.5 size-4" />
        </Link>
        <Link
          className={cn(
            buttonVariants({
              className: "h-12 rounded-full px-8 text-sm",
              variant: "outline",
            })
          )}
          href="/dashboard"
        >
          View Dashboard
        </Link>
      </div>

      <div className="grid animate-fade-up gap-px overflow-hidden rounded-2xl border bg-border/40 [animation-delay:360ms] md:grid-cols-3">
        {FEATURES.map((feature) => (
          <div className="bg-background p-5" key={feature.label}>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  feature.bgClass
                )}
              >
                <feature.icon className={cn("h-4 w-4", feature.iconClass)} />
              </div>
              <div>
                <p className="font-medium text-sm">{feature.label}</p>
                <p className="text-muted-foreground text-xs">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
