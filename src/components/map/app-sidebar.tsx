"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Map,
  Users,
  Briefcase,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { ThemeToggle } from "./theme-toggle";
import { PassportIcon } from "@/components/icons/passport-icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Search, label: "Search", href: "/" },
  { icon: Map, label: "Trips", href: "/" },
  { icon: Users, label: "Friends", href: "/" },
  { icon: Briefcase, label: "Luggage", href: "/" },
  { icon: "passport", label: "Passport", href: "/" },
] as const;

function SidebarContent({
  onLinkClick,
  forceExpanded,
}: { onLinkClick?: () => void; forceExpanded?: boolean }) {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const isCollapsed = forceExpanded ? false : collapsed;

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn("flex items-center p-3", isCollapsed ? "justify-center" : "justify-between gap-2")}>
          {isCollapsed ? (
            <div className="group relative flex w-full items-center justify-center py-1">
              <Image
                src="/img/logo/logo.png"
                alt="Map"
                width={32}
                height={32}
                className="h-8 w-8 shrink-0 object-contain transition-opacity group-hover:opacity-0"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleCollapsed}
                className="font-departure-mono absolute inset-0 m-auto flex h-8 w-8 shrink-0 items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 border-0 shadow-none hover:bg-transparent"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link href="/" onClick={onLinkClick} className="flex items-center min-w-0 shrink-0">
                <Image
                  src="/img/logo/logo.png"
                  alt="Map"
                  width={120}
                  height={32}
                  className="h-8 w-auto max-w-[140px] object-contain"
                />
              </Link>
              {!forceExpanded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCollapsed}
                  className="font-departure-mono h-8 w-8 shrink-0 border-0 shadow-none hover:bg-transparent"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>

        <nav className={cn("flex flex-col gap-1 px-2 pb-4", isCollapsed ? "px-2" : "px-4")}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className={cn(
                "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
                isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3",
                pathname === item.href && "bg-transparent"
              )}
              asChild
            >
              <Link href={item.href} onClick={onLinkClick} title={isCollapsed ? item.label : undefined}>
                {item.icon === "passport" ? (
                  <PassportIcon />
                ) : (
                  <item.icon className="h-4 w-4 shrink-0" />
                )}
                {!isCollapsed && item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>

      <div className={cn("shrink-0 border-t border-border p-4", isCollapsed && "p-2")}>
        <div className={cn("mb-4 w-full", isCollapsed && "flex justify-center")}>
          <ThemeToggle collapsed={isCollapsed} />
        </div>
        <Separator className="mb-4" />
        <div
          className={cn(
            "flex items-center gap-3",
            isCollapsed && "flex-col justify-center"
          )}
        >
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="font-departure-mono text-xs">U</AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto shrink-0 border-0 shadow-none hover:bg-transparent", isCollapsed && "ml-0 w-full justify-center")}
            asChild
          >
            <Link href="/settings" onClick={onLinkClick} title={isCollapsed ? "Settings" : undefined}>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarWidth } = useSidebar();

  return (
    <>
      <aside
        className="fixed left-0 top-0 z-40 h-screen border-r bg-card font-departure-mono flex flex-col overflow-hidden hidden md:flex transition-[width] duration-200 ease-out"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent />
      </aside>

      <div className="fixed left-0 top-0 z-40 flex md:hidden items-center gap-2 p-2">
        <Link href="/" className="shrink-0">
          <Image
            src="/img/logo/logo.png"
            alt="Map"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="font-departure-mono shrink-0"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} modal={false}>
        <SheetContent side="left" className="w-[260px] p-0 flex flex-col">
          <div className="flex flex-1 flex-col overflow-hidden font-departure-mono pt-4">
            <SidebarContent onLinkClick={() => setMobileOpen(false)} forceExpanded />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
