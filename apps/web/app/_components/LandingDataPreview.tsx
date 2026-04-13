import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { cn } from "@workspace/ui/lib/utils";

type MessagePreview = {
  _id: string;
  body: string;
  source: string;
};

type ScrapePreview = {
  _id: string;
  mode: string;
  summary: string;
  url: string;
};

type LandingDataPreviewProps = {
  hasConvex: boolean;
  messages: MessagePreview[];
  scrapes: ScrapePreview[];
};

export function LandingDataPreview({
  hasConvex,
  messages,
  scrapes,
}: LandingDataPreviewProps) {
  const primaryMessage = messages[0];
  const previewScrapes = scrapes.slice(0, 2);

  return (
    <div className="flex flex-col gap-8" id="convex-preview">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-[0.35em]">
            Convex Preview
          </p>
          <h2 className="mt-2 font-heading text-3xl tracking-tight md:text-4xl">
            Seeded sample data
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              hasConvex
                ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
                : "bg-amber-500"
            )}
          />
          <span className="rounded-full border px-3 py-0.5 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-wider">
            {hasConvex ? "connected" : "offline"}
          </span>
        </div>
      </div>

      {hasConvex ? (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Message
            </h3>
            {primaryMessage ? (
              <div className="rounded-xl border p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium capitalize">
                    {primaryMessage.source}
                  </p>
                  <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[0.6rem] uppercase">
                    {primaryMessage.source}
                  </span>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                  {primaryMessage.body}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No seeded messages yet.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-[0.2em]">
              Recent Scrape Runs
            </h3>
            <div className="flex flex-col gap-3">
              {previewScrapes.map((scrape) => (
                <div className="rounded-xl border p-5" key={scrape._id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium capitalize">{scrape.mode}</p>
                    <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[0.6rem] uppercase">
                      {scrape.mode}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-muted-foreground text-sm leading-relaxed">
                    {scrape.summary}
                  </p>
                  <p className="mt-2 truncate font-mono text-[0.6rem] text-muted-foreground/70">
                    {scrape.url}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Alert>
          <AlertTitle>Convex is not available for the landing page.</AlertTitle>
          <AlertDescription>
            Run the app with `CONVEX_URL` or `NEXT_PUBLIC_CONVEX_URL` through
            Infisical to show seeded sample data here.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
