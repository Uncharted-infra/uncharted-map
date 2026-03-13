"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageShellProps {
  title: string;
  description?: string;
  badge?: string | number;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({ title, description, badge, actions, children }: PageShellProps) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="font-departure-mono text-2xl font-semibold truncate">{title}</h1>
            {badge !== undefined && (
              <Badge variant="secondary" className="font-departure-mono shrink-0">
                {badge}
              </Badge>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
        {description && (
          <p className="mb-6 text-sm text-muted-foreground font-departure-mono">{description}</p>
        )}
        {children}
      </div>
    </ScrollArea>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-muted-foreground font-departure-mono text-center">{message}</p>
    </div>
  );
}
