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
  Compass,
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
import { useSidebar, SIDEBAR_WIDTH_EXPANDED } from "@/contexts/sidebar-context";
import { PassportIcon } from "@/components/icons/passport-icon";
import { PrimaryGrowButton, SecondaryGrowButton } from "@/components/ui/grow-button";
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
import { SettingsModal } from "@/components/map/settings-modal";
import { cn } from "@/lib/utils";

// Placeholder trips - will be replaced with real data when trips are created
const PLACEHOLDER_TRIPS: { id: string; name: string }[] = [];

// Plan tiers: adventurer | nomad | wanderlust | enterprise
const CURRENT_PLAN = "enterprise";

const luggageItems = [
  { icon: MapPin, label: "Places", href: "/luggage/places" },
  { icon: Building2, label: "Hotels", href: "/luggage/hotels" },
  { icon: Plane, label: "Flights", href: "/luggage/flights" },
] as const;

const documentItems = [
  { icon: Plane, label: "Flights", href: "/documents/flights" },
  { icon: Building2, label: "Hotels", href: "/documents/hotels" },
  { icon: Activity, label: "Activities", href: "/documents/activities" },
] as const;

function ThemeRadioGroup({ theme, setTheme }: { theme: string | undefined; setTheme: (v: string) => void }) {
  return (
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
  );
}

function CollapsibleNavSection({
  icon: Icon,
  label,
  href,
  title,
  isCollapsed,
  open,
  onToggle,
  onCollapsedClick,
  onLinkClick,
  children,
}: {
  icon: typeof Map;
  label: string;
  href: string;
  title: string;
  isCollapsed: boolean;
  open: boolean;
  onToggle: () => void;
  onCollapsedClick?: () => void;
  onLinkClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {isCollapsed ? (
        <PrimaryGrowButton className="font-departure-mono text-sm justify-center px-0 w-full" title={title} onClick={onCollapsedClick}>
          <Icon className="h-4 w-4 shrink-0" />
        </PrimaryGrowButton>
      ) : (
        <PrimaryGrowButton
          className="font-departure-mono text-sm justify-start gap-3 w-full"
          asChild
        >
          <Link href={href} onClick={onLinkClick} className="flex items-center gap-3 w-full min-w-0">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            <span
              role="button"
              tabIndex={0}
              className="flex shrink-0 cursor-pointer p-0.5 -m-0.5 rounded hover:bg-accent/50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggle();
                }
              }}
            >
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
            </span>
          </Link>
        </PrimaryGrowButton>
      )}
      {!isCollapsed && open && <div className="ml-6 flex flex-col gap-0.5 border-l border-border pl-3">{children}</div>}
    </div>
  );
}

function SidebarContent({
  onLinkClick,
  forceExpanded,
  onOpenSettings,
}: { onLinkClick?: () => void; forceExpanded?: boolean; onOpenSettings?: () => void }) {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed, sidebarWidth } = useSidebar();
  const { theme, setTheme } = useTheme();
  const isCollapsed = forceExpanded ? false : collapsed;
  const profileMenuWidth = forceExpanded ? SIDEBAR_WIDTH_EXPANDED : sidebarWidth;
  const [tripsOpen, setTripsOpen] = useState(false);
  const [luggageOpen, setLuggageOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn("flex items-center p-3", isCollapsed ? "justify-center" : "justify-between gap-2")}>
          {isCollapsed ? (
            <PrimaryGrowButton
              size="icon"
              onClick={toggleCollapsed}
              className="font-departure-mono h-8 w-8 shrink-0"
              aria-label="Expand sidebar"
            >
              <PanelLeftOpen className="h-4 w-4" />
            </PrimaryGrowButton>
          ) : (
            <>
              <Link href="/" onClick={onLinkClick} className="flex items-center min-w-0 shrink-0 font-departure-mono text-base font-semibold">
                Uncharted
              </Link>
              {!forceExpanded && (
                <PrimaryGrowButton
                  size="icon"
                  onClick={toggleCollapsed}
                  className="font-departure-mono h-8 w-8 shrink-0"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </PrimaryGrowButton>
              )}
            </>
          )}
        </div>

        <nav className={cn("flex flex-col gap-1 pb-4", isCollapsed ? "pl-[3px] pr-2" : "pl-[7px] pr-3")}>
          <PrimaryGrowButton
            className={cn(
              "font-departure-mono text-sm",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3"
            )}
            asChild
          >
            <Link href="/" onClick={onLinkClick} title={isCollapsed ? "New Trip" : undefined}>
              <MapPinPlus className="h-4 w-4 shrink-0" />
              {!isCollapsed && "New Trip"}
            </Link>
          </PrimaryGrowButton>

          <PrimaryGrowButton
            className={cn(
              "font-departure-mono text-sm",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3",
              pathname === "/search" && "bg-transparent"
            )}
            asChild
          >
            <Link href="/search" onClick={onLinkClick} title={isCollapsed ? "Search" : undefined}>
              <Search className="h-4 w-4 shrink-0" />
              {!isCollapsed && "Search"}
            </Link>
          </PrimaryGrowButton>

          <PrimaryGrowButton
            className={cn(
              "font-departure-mono text-sm",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3"
            )}
            asChild
          >
            <Link href="/compass" onClick={onLinkClick} title={isCollapsed ? "Compass" : undefined}>
              <Compass className="h-4 w-4 shrink-0" />
              {!isCollapsed && "Compass"}
            </Link>
          </PrimaryGrowButton>

          <CollapsibleNavSection
            icon={Map}
            label="Trips"
            href="/trip"
            title="Trips"
            isCollapsed={isCollapsed}
            open={tripsOpen}
            onToggle={() => setTripsOpen((o) => !o)}
            onCollapsedClick={() => { toggleCollapsed(); setTripsOpen(true); }}
            onLinkClick={onLinkClick}
          >
            {PLACEHOLDER_TRIPS.length === 0 ? (
              <span className="font-departure-mono text-xs text-muted-foreground py-1">No trips yet</span>
            ) : (
              PLACEHOLDER_TRIPS.map((trip) => (
                <Link key={trip.id} href={`/trip/${trip.id}`} onClick={onLinkClick} className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1">
                  {trip.name}
                </Link>
              ))
            )}
          </CollapsibleNavSection>

          <CollapsibleNavSection
            icon={Briefcase}
            label="Luggage"
            href="/luggage"
            title="Luggage"
            isCollapsed={isCollapsed}
            open={luggageOpen}
            onToggle={() => setLuggageOpen((o) => !o)}
            onCollapsedClick={() => { toggleCollapsed(); setLuggageOpen(true); }}
            onLinkClick={onLinkClick}
          >
            {luggageItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={onLinkClick} className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1 flex items-center gap-2">
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </Link>
            ))}
          </CollapsibleNavSection>

          <CollapsibleNavSection
            icon={FileText}
            label="Documents"
            href="/documents"
            title="Documents"
            isCollapsed={isCollapsed}
            open={documentsOpen}
            onToggle={() => setDocumentsOpen((o) => !o)}
            onCollapsedClick={() => { toggleCollapsed(); setDocumentsOpen(true); }}
            onLinkClick={onLinkClick}
          >
            {documentItems.map((item) => (
              <Link key={item.label} href={item.href} onClick={onLinkClick} className="font-departure-mono text-sm hover:text-foreground text-muted-foreground py-1 flex items-center gap-2">
                <item.icon className="h-3.5 w-3.5 shrink-0" />
                {item.label}
              </Link>
            ))}
          </CollapsibleNavSection>
        </nav>
      </div>

      <div className={cn("shrink-0 border-t border-border", isCollapsed ? "p-2 flex justify-center" : "pl-[0px] pr-3 py-4")}>
        {isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <PrimaryGrowButton
                suppressHydrationWarning
                className="h-8 w-8 rounded-full p-0 font-departure-mono"
                aria-label="Profile menu"
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium font-departure-mono">
                    AS
                  </AvatarFallback>
                </Avatar>
              </PrimaryGrowButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="top" className="font-departure-mono" style={{ width: profileMenuWidth }}>
              <DropdownMenuItem onClick={onOpenSettings}>
                <PassportIcon />
                Passport
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ThemeRadioGroup theme={theme} setTheme={setTheme} />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <PrimaryGrowButton
                  type="button"
                  className="flex items-center gap-3 min-w-0 w-full justify-start text-left font-departure-mono px-4"
                  aria-label="Profile menu"
                >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium font-departure-mono">
                        AS
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        Ayush Sharma
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {CURRENT_PLAN.charAt(0).toUpperCase() + CURRENT_PLAN.slice(1)}
                      </p>
                    </div>
                  </PrimaryGrowButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top" className="font-departure-mono -translate-x-[0px]" style={{ width: profileMenuWidth }}>
                  <DropdownMenuItem onClick={onOpenSettings}>
                    <PassportIcon />
                    Passport
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ThemeRadioGroup theme={theme} setTheme={setTheme} />
                </DropdownMenuContent>
              </DropdownMenu>
            <SecondaryGrowButton size="sm" className="w-full font-departure-mono justify-start px-4" asChild>
              <Link href="/" onClick={onLinkClick} className="flex items-center">
                Upgrade
              </Link>
            </SecondaryGrowButton>
          </div>
        )}
      </div>
    </div>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { sidebarWidth } = useSidebar();

  return (
    <>
      <aside
        className="fixed left-0 top-0 z-40 h-screen border-r bg-card font-departure-mono flex flex-col overflow-hidden hidden md:flex transition-[width] duration-200 ease-out"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent onOpenSettings={() => setSettingsOpen(true)} />
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
        <PrimaryGrowButton
          size="icon"
          onClick={() => setMobileOpen(true)}
          className="font-departure-mono shrink-0"
        >
          <Menu className="h-5 w-5" />
        </PrimaryGrowButton>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} modal={false}>
        <SheetContent side="left" className="w-[260px] p-0 flex flex-col">
          {mobileOpen && (
            <div className="flex flex-1 flex-col overflow-hidden font-departure-mono pt-4">
              <SidebarContent
                onLinkClick={() => setMobileOpen(false)}
                forceExpanded
                onOpenSettings={() => {
                  setMobileOpen(false)
                  setSettingsOpen(true)
                }}
              />
            </div>
          )}
        </SheetContent>
      </Sheet>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
