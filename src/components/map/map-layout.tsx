"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { ConversationPanel } from "./conversation-panel";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { TripsProvider } from "@/contexts/trips-context";
import { NewTripProvider } from "@/contexts/new-trip-context";
import { useIsMobile } from "@/hooks/use-mobile";

const AppSidebar = dynamic(
  () => import("./app-sidebar").then((m) => ({ default: m.AppSidebar })),
  {
    ssr: false,
    loading: () => (
      <aside
        className="fixed left-0 top-0 z-40 h-screen border-r bg-card hidden md:block w-[260px] shrink-0"
        aria-hidden
      />
    ),
  }
);

function MapLayoutContent({ children }: { children?: React.ReactNode }) {
  const { sidebarWidth } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <main
        className={cn(
          "flex flex-1 min-w-0 pl-24 md:pl-0 transition-[margin] duration-200 ease-out",
          !isMobile && "border-l border-border"
        )}
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {children ?? <ConversationPanel className="flex-1 min-w-0" />}
      </main>
    </div>
  );
}

export function MapLayout({ children }: { children?: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TripsProvider>
        <NewTripProvider>
          <MapLayoutContent>{children}</MapLayoutContent>
        </NewTripProvider>
      </TripsProvider>
    </SidebarProvider>
  );
}
