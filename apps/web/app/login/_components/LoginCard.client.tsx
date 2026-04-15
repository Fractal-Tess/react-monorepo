"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { useAuthFormStore } from "@/stores/auth-form-store";

export function LoginCard({ className }: { className?: string }) {
  const router = useRouter();
  const mode = useAuthFormStore((state) => state.mode);
  const form = useAuthFormStore((state) => state.form);
  const error = useAuthFormStore((state) => state.error);
  const isSubmitting = useAuthFormStore((state) => state.isSubmitting);
  const setMode = useAuthFormStore((state) => state.setMode);
  const setField = useAuthFormStore((state) => state.setField);
  const setError = useAuthFormStore((state) => state.setError);
  const setIsSubmitting = useAuthFormStore((state) => state.setIsSubmitting);
  const resetForm = useAuthFormStore((state) => state.resetForm);
  let submitLabel = "Create account";

  if (mode === "sign-in") {
    submitLabel = "Sign in";
  }

  if (isSubmitting) {
    submitLabel = "Working...";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-up") {
        const result = await authClient.signUp.email({
          email: form.email,
          name: form.name,
          password: form.password,
        });

        if (result.error) {
          setError(result.error.message ?? "Unable to create an account.");
          return;
        }
      } else {
        const result = await authClient.signIn.email({
          email: form.email,
          password: form.password,
        });

        if (result.error) {
          setError(result.error.message ?? "Unable to sign in.");
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className={cn("rounded-3xl border bg-card p-7 md:p-9", className)}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col gap-2 text-center">
          <p className="font-medium text-[0.65rem] text-muted-foreground uppercase tracking-[0.3em]">
            {mode === "sign-in" ? "Welcome back" : "Get started"}
          </p>
          <h1 className="font-heading text-2xl tracking-tight md:text-3xl">
            {mode === "sign-in"
              ? "Sign in to your account"
              : "Create your account"}
          </h1>
          <p className="text-muted-foreground text-sm">
            Better Auth against your Convex deployment.
          </p>
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Auth error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <div className="grid grid-cols-2 gap-1 rounded-full border bg-muted/50 p-1">
          <Button
            className="rounded-full"
            onClick={() => setMode("sign-in")}
            type="button"
            variant={mode === "sign-in" ? "default" : "ghost"}
          >
            Sign in
          </Button>
          <Button
            className="rounded-full"
            onClick={() => setMode("sign-up")}
            type="button"
            variant={mode === "sign-up" ? "default" : "ghost"}
          >
            Create account
          </Button>
        </div>
        {mode === "sign-up" ? (
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              onChange={(event) => setField("name", event.target.value)}
              placeholder="Ada Lovelace"
              required
              value={form.name}
            />
          </Field>
        ) : null}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            onChange={(event) => setField("email", event.target.value)}
            placeholder="ada@example.com"
            required
            type="email"
            value={form.email}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            minLength={8}
            onChange={(event) => setField("password", event.target.value)}
            required
            type="password"
            value={form.password}
          />
          <FieldDescription>
            Passwords must be at least 8 characters long.
          </FieldDescription>
        </Field>
        <Field>
          <Button
            className="w-full rounded-full"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <LoaderCircleIcon className="animate-spin" />
            ) : null}
            {submitLabel}
          </Button>
        </Field>
        <FieldSeparator>Need context first?</FieldSeparator>
        <Field>
          <FieldDescription className="text-center">
            Head back to the{" "}
            <Link className="underline underline-offset-4" href="/">
              landing page
            </Link>{" "}
            to review the Convex-backed preview before signing in.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
