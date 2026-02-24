"use client";

import { cn } from "@/lib/utils";
import { AppSidebar } from "./app-sidebar";
import { ConversationPanel } from "./conversation-panel";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";

function MapLayoutContent() {
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
        <ConversationPanel className="flex-1 min-w-0" />
      </main>
    </div>
  );
}

export function MapLayout() {
  return (
    <SidebarProvider>
      <MapLayoutContent />
    </SidebarProvider>
  );
}
