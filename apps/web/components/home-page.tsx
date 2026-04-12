import { getWelcomeMessage } from "@workspace/shared"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@workspace/ui/components/tooltip"

import { ConvexDemo } from "./convex-demo"

type HomePageProps = {
  convexEnabled: boolean
}

export function HomePage({ convexEnabled }: HomePageProps) {
  return (
    <TooltipProvider>
      <main className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Workspace ready</CardTitle>
            <CardDescription>{getWelcomeMessage("web app")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              The Next.js app, Bun worker, and Convex package all share the same
              library now.
            </p>
            <Tooltip>
              <TooltipTrigger className="text-sm font-medium underline underline-offset-4">
                Shared package wiring
              </TooltipTrigger>
              <TooltipContent>
                Imports resolve through workspace packages instead of app-local copies.
              </TooltipContent>
            </Tooltip>
            <ConvexDemo enabled={convexEnabled} />
          </CardContent>
        </Card>
      </main>
    </TooltipProvider>
  )
}
