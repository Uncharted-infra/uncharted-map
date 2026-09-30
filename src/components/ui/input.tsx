import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-muted focus:border-caramel focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
