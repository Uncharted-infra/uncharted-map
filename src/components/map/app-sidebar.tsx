"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Map,
  Briefcase,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Monitor,
  MapPinPlus,
  ChevronDown,
  MapPin,
  Building2,
  Plane,
  Activity,
  FileText,
} from "lucide-react";
import { useSidebar } from "@/contexts/sidebar-context";
import { PassportIcon } from "@/components/icons/passport-icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// Placeholder trips - will be replaced with real data when trips are created
const PLACEHOLDER_TRIPS: { id: string; name: string }[] = [];

const luggageItems = [
  { icon: MapPin, label: "Places", href: "/luggage/places" },
  { icon: Building2, label: "Hotels", href: "/luggage/hotels" },
  { icon: Plane, label: "Flights", href: "/luggage/flights" },
] as const;

const documentItems = [
  { icon: Plane, label: "Flights", href: "/passport/flights" },
  { icon: Building2, label: "Hotels", href: "/passport/hotels" },
  { icon: Activity, label: "Activities", href: "/passport/activities" },
] as const;

function SidebarContent({
  onLinkClick,
  forceExpanded,
}: { onLinkClick?: () => void; forceExpanded?: boolean }) {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isCollapsed = forceExpanded ? false : collapsed;
  const [tripsOpen, setTripsOpen] = useState(false);
  const [luggageOpen, setLuggageOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

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
          <Button
            variant="ghost"
            className={cn(
              "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3"
            )}
            asChild
          >
            <Link href="/" onClick={onLinkClick} title={isCollapsed ? "New Trip" : undefined}>
              <MapPinPlus className="h-4 w-4 shrink-0" />
              {!isCollapsed && "New Trip"}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3",
              pathname === "/" && "bg-transparent"
            )}
            asChild
          >
            <Link href="/" onClick={onLinkClick} title={isCollapsed ? "Search" : undefined}>
              <Search className="h-4 w-4 shrink-0" />
              {!isCollapsed && "Search"}
            </Link>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3"
            )}
            asChild
          >
            <Link href="/passport" onClick={onLinkClick} title={isCollapsed ? "Passport" : undefined}>
              <PassportIcon />
              {!isCollapsed && "Passport"}
            </Link>
          </Button>

          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              className={cn(
                "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
                isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3 w-full"
              )}
              title={isCollapsed ? "Trips" : undefined}
              onClick={() => {
                if (isCollapsed) {
                  toggleCollapsed();
                  setTripsOpen(true);
                } else {
                  setTripsOpen((o) => !o);
                }
              }}
            >
              <Map className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Trips</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", tripsOpen && "rotate-180")}
                  />
                </>
              )}
            </Button>
            {!isCollapsed && tripsOpen && (
              <div className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">
                {PLACEHOLDER_TRIPS.length === 0 ? (
                  <span className="font-departure-mono text-xs text-muted-foreground py-1">
                    No trips yet
                  </span>
                ) : (
                  PLACEHOLDER_TRIPS.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      onClick={onLinkClick}
                      className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1"
                    >
                      {trip.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              className={cn(
                "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
                isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3 w-full"
              )}
              title={isCollapsed ? "Luggage" : undefined}
              onClick={() => {
                if (isCollapsed) {
                  toggleCollapsed();
                  setLuggageOpen(true);
                } else {
                  setLuggageOpen((o) => !o);
                }
              }}
            >
              <Briefcase className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Luggage</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", luggageOpen && "rotate-180")}
                  />
                </>
              )}
            </Button>
            {!isCollapsed && luggageOpen && (
              <div className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">
                {luggageItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onLinkClick}
                    className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1 flex items-center gap-2"
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              className={cn(
                "font-departure-mono text-sm border-0 shadow-none hover:bg-transparent hover:shadow-md active:shadow-none transition-shadow duration-200",
                isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3 w-full"
              )}
              title={isCollapsed ? "Documents" : undefined}
              onClick={() => {
                if (isCollapsed) {
                  toggleCollapsed();
                  setDocumentsOpen(true);
                } else {
                  setDocumentsOpen((o) => !o);
                }
              }}
            >
              <FileText className="h-4 w-4 shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">Documents</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 transition-transform", documentsOpen && "rotate-180")}
                  />
                </>
              )}
            </Button>
            {!isCollapsed && documentsOpen && (
              <div className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">
                {documentItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={onLinkClick}
                    className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1 flex items-center gap-2"
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className={cn("shrink-0 p-4", isCollapsed && "p-2")}>
        <div className={cn(isCollapsed && "flex justify-center")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-8 w-8 rounded-full p-0 border-0 shadow-none hover:bg-transparent",
                  isCollapsed && "w-8"
                )}
                aria-label="Profile menu"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="font-departure-mono text-xs">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isCollapsed ? "center" : "start"} side="top" className="font-departure-mono">
              <DropdownMenuItem asChild>
                <Link href="/settings" onClick={onLinkClick}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light" className="gap-2">
                  <Sun className="h-4 w-4 shrink-0" />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark" className="gap-2">
                  <Moon className="h-4 w-4 shrink-0" />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system" className="gap-2">
                  <Monitor className="h-4 w-4 shrink-0" />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
