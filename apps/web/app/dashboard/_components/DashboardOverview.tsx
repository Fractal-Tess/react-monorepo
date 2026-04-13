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

type DashboardOverviewProps = {
  messages: MessagePreview[];
  scrapes: ScrapePreview[];
  user: {
    email: string | null;
    name: string | null;
  };
};

export function DashboardOverview({
  messages,
  scrapes,
  user,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <section
        className="grid gap-4 rounded-[2rem] border bg-[radial-gradient(circle_at_top_left,hsl(173_72%_47%/0.18),transparent_35%),radial-gradient(circle_at_bottom_right,hsl(35_95%_60%/0.14),transparent_38%),hsl(var(--background))] p-6"
        id="snapshot"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-muted-foreground text-sm uppercase tracking-[0.26em]">
              Dashboard snapshot
            </p>
            <h1 className="mt-2 font-semibold text-3xl tracking-tight">
              Welcome back{user.name ? `, ${user.name}` : ""}.
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-7">
              This view combines your Better Auth session with Convex sample
              data so the signed-in experience feels like a workspace instead of
              a bare component demo.
            </p>
          </div>
          <Badge className="rounded-full px-4 py-1.5">Authenticated</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm">
                Current user
              </CardTitle>
            </CardHeader>
            <CardContent className="font-semibold text-xl">
              {user.email ?? "Unknown"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm">
                Seeded messages
              </CardTitle>
            </CardHeader>
            <CardContent className="font-semibold text-xl">
              {messages.length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm">
                Recent scrapes
              </CardTitle>
            </CardHeader>
            <CardContent className="font-semibold text-xl">
              {scrapes.length}
            </CardContent>
          </Card>
        </div>
      </section>
      <section
        className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
        id="recent-data"
      >
        <Card>
          <CardHeader>
            <CardTitle>Latest messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message) => (
              <div className="rounded-2xl border p-4" key={message._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium capitalize">{message.source}</p>
                  <Badge variant="outline">{message.source}</Badge>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-7">
                  {message.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent scrape runs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {scrapes.map((scrape) => (
              <div className="rounded-2xl border p-4" key={scrape._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium capitalize">{scrape.mode}</p>
                  <Badge variant="outline">{scrape.mode}</Badge>
                </div>
                <p className="mt-3 text-muted-foreground text-sm leading-7">
                  {scrape.summary}
                </p>
                <p className="mt-3 truncate text-muted-foreground text-xs">
                  {scrape.url}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
