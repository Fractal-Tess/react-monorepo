import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

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
    <section
      className="flex h-full flex-col rounded-[2rem] border bg-background/84 p-6 shadow-[0_24px_90px_-50px_hsl(var(--foreground)/0.35)] backdrop-blur md:p-8"
      id="convex-preview"
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-muted-foreground text-sm uppercase tracking-[0.26em]">
            Convex Preview
          </p>
          <h2 className="mt-2 font-semibold text-2xl tracking-tight">
            Seeded sample data
          </h2>
        </div>
        <Badge variant={hasConvex ? "default" : "outline"}>
          {hasConvex ? "Deployment connected" : "Convex not configured"}
        </Badge>
      </div>
      {hasConvex ? (
        <div className="grid flex-1 gap-4">
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Message</CardTitle>
            </CardHeader>
            <CardContent>
              {primaryMessage ? (
                <Alert>
                  <AlertTitle className="capitalize">
                    {primaryMessage.source}
                  </AlertTitle>
                  <AlertDescription>{primaryMessage.body}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No seeded messages yet.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="border-border/70">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent scrape runs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {previewScrapes.map((scrape) => (
                <div
                  className="rounded-2xl border border-border/70 p-4"
                  key={scrape._id}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium capitalize">{scrape.mode}</p>
                    <Badge variant="outline">{scrape.mode}</Badge>
                  </div>
                  <p className="mt-3 line-clamp-3 text-muted-foreground text-sm leading-7">
                    {scrape.summary}
                  </p>
                  <p className="mt-3 truncate text-muted-foreground text-xs">
                    {scrape.url}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
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
    </section>
  );
}
