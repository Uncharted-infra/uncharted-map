import { cn } from "@/lib/utils";

export function PassportIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 shrink-0", className)}
      aria-hidden
    >
      <path d="M12 6v8" />
      <path d="M9 18h6" />
      <circle cx="12" cy="10" r="4" />
      <rect x="4" y="2" width="16" height="20" rx="2" />
    </svg>
  );
}
