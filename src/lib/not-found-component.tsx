import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function AppNotFoundComponent() {
  return (
    <main
      className={
        "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center " +
        "bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50"
      }
    >
      <span className="text-zinc-400" aria-hidden="true">
        <Compass className="size-10" strokeWidth={2} />
      </span>
      <h1 className="text-lg font-semibold">Page not found</h1>
      <p className="max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400">
        That page doesn't exist. Head back and keep quizzing.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back to quiz
      </Link>
    </main>
  );
}
