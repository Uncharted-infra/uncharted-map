"use client";

import { useState } from "react";
import { AppSidebar } from "./app-sidebar";
import { ConversationPanel } from "./conversation-panel";
import { ContextPanel } from "./context-panel";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { SidebarProvider, useSidebar } from "@/contexts/sidebar-context";
import { useIsMobile } from "@/hooks/use-mobile";

function MapLayoutContent() {
  const [contextOpen, setContextOpen] = useState(false);
  const { sidebarWidth } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />

      <main
        className="flex flex-1 min-w-0 pl-24 md:pl-0 transition-[margin] duration-200 ease-out"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className="flex flex-1 min-w-0">
          <ConversationPanel className="flex-1 min-w-0" />

          <div className="hidden lg:block">
            <ContextPanel />
          </div>

          <div className="lg:hidden fixed bottom-4 right-4 z-50">
            <Button
              size="icon"
              onClick={() => setContextOpen(true)}
              className="rounded-full"
            >
              <PanelRightOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <Sheet open={contextOpen} onOpenChange={setContextOpen} modal={false}>
        <SheetContent side="right" className="w-full max-w-[320px] p-0">
          <ContextPanel className="border-0 h-full w-full" />
        </SheetContent>
      </Sheet>
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
