import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { type FormEvent, useState } from "react";
import { greet } from "./lib/bindings";

export function App() {
  const [name, setName] = useState("Fractal");
  const [greeting, setGreeting] = useState("Hello from Tauri.");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = await greet(name);
    setGreeting(message);
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background p-8">
      <Card className="w-full max-w-xl border border-border/60 bg-card/90 shadow-2xl shadow-black/25 backdrop-blur">
        <CardHeader>
          <CardTitle>Tauri Desktop App</CardTitle>
          <CardDescription>
            Uses <code>@workspace/ui</code> components and Tailwind styles from
            the shared UI package.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="name">
              Name
            </label>
            <Input
              id="name"
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              value={name}
            />
            <Button type="submit">Greet</Button>
          </form>
          <p className="mt-4 text-muted-foreground">{greeting}</p>
        </CardContent>
      </Card>
    </main>
  );
}
