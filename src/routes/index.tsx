import { createFileRoute } from "@tanstack/react-router";
import { InterviewApp } from "@/components/hub/InterviewApp";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <InterviewApp />;
}
