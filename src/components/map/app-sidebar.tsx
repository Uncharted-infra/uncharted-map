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
  FileText,
  CalendarDays,
  Receipt,
  Stamp,
  MoreVertical,
  Share2,
  Users,
  Pencil,
  Pin,
  Archive,
  Trash2,
  Settings,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SettingsModal } from "@/components/map/settings-modal";
import { useTripsOptional } from "@/contexts/trips-context";
import { useNewTrip } from "@/contexts/new-trip-context";
import type { Trip } from "@/lib/trips-state";
import { cn } from "@/lib/utils";

const MODE_LABELS: Record<"explore" | "plan" | "book", string> = {
  explore: "Explore",
  plan: "Plan",
  book: "Book",
};

// Plan tiers: adventurer | nomad | wanderlust | enterprise
const CURRENT_PLAN = "enterprise";

const luggageItems = [
  { icon: MapPin, label: "Places", href: "/luggage/places" },
  { icon: Building2, label: "Hotels", href: "/luggage/hotels" },
  { icon: Plane, label: "Flights", href: "/luggage/flights" },
] as const;

const documentItems = [
  { icon: CalendarDays, label: "Itinerary", href: "/documents/itinerary" },
  { icon: Receipt, label: "Receipts", href: "/documents/receipts" },
  { icon: Stamp, label: "Visas", href: "/documents/visas" },
] as const;

function ThemeRadioGroup({ theme, setTheme }: { theme: string | undefined; setTheme: (v: string) => void }) {
  const radioItemClass = "gap-2 !pl-2 [&>span]:left-auto [&>span]:right-2";
  return (
    <DropdownMenuRadioGroup value={theme ?? "system"} onValueChange={setTheme}>
      <DropdownMenuRadioItem value="light" className={radioItemClass}>
        <Sun className="h-4 w-4 shrink-0" />
        Light
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="dark" className={radioItemClass}>
        <Moon className="h-4 w-4 shrink-0" />
        Dark
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem value="system" className={radioItemClass}>
        <Monitor className="h-4 w-4 shrink-0" />
        System
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
}

function TripItem({
  trip,
  onLinkClick,
  updateTrip,
  removeTrip,
}: {
  trip: Trip;
  onLinkClick?: () => void;
  updateTrip: (id: string, updates: Partial<Pick<Trip, "name" | "pinned" | "archived">>) => Trip | null;
  removeTrip: (id: string) => boolean;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(trip.name);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2000);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = typeof window !== "undefined" ? `${window.location.origin}/trip/${trip.id}` : "";
    navigator.clipboard.writeText(url).then(() => showFeedback("Link copied!"));
  };

  const handleGroupTrip = (e: React.MouseEvent) => {
    e.preventDefault();
    showFeedback("Group trip coming soon");
  };

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    setRenameValue(trip.name);
    setRenameOpen(true);
  };

  const handleRenameSubmit = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== trip.name) {
      updateTrip(trip.id, { name: trimmed });
      showFeedback("Renamed");
    }
    setRenameOpen(false);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.preventDefault();
    updateTrip(trip.id, { pinned: !trip.pinned });
    showFeedback(trip.pinned ? "Unpinned" : "Pinned");
  };

  const handleArchive = (e: React.MouseEvent) => {
    e.preventDefault();
    updateTrip(trip.id, { archived: !trip.archived });
    showFeedback(trip.archived ? "Restored" : "Archived");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    removeTrip(trip.id);
    showFeedback("Deleted");
  };

  return (
    <>
      <div className="group flex items-center gap-1 min-w-0 py-1.5">
        <Link
          href={`/trip/${trip.id}`}
          onClick={onLinkClick}
          className="flex-1 min-w-0 flex flex-col gap-0.5 font-departure-mono text-sm hover:text-foreground text-muted-foreground"
        >
          <span className="font-medium text-foreground truncate flex items-center gap-1.5">
            {trip.pinned && <Pin className="h-3 shrink-0 opacity-60" />}
            {trip.name}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {MODE_LABELS[trip.mode]} · {trip.date}
          </span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.preventDefault()}
              className="shrink-0 p-1 rounded hover:bg-accent/50 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity focus:outline-none focus:ring-0"
              aria-label="Trip actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="font-departure-mono w-48">
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="h-4 w-4 shrink-0" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleGroupTrip}>
              <Users className="h-4 w-4 shrink-0" />
              Group trip
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename}>
              <Pencil className="h-4 w-4 shrink-0" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePin}>
              <Pin className="h-4 w-4 shrink-0" />
              {trip.pinned ? "Unpin chat" : "Pin chat"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleArchive}>
              <Archive className="h-4 w-4 shrink-0" />
              {trip.archived ? "Unarchive" : "Archive"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 shrink-0" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {actionFeedback && (
        <span className="absolute left-0 right-0 top-full text-xs text-muted-foreground text-center py-0.5 animate-in fade-in-0">
          {actionFeedback}
        </span>
      )}
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="font-departure-mono gap-4">
          <DialogHeader>
            <DialogTitle>Rename trip</DialogTitle>
          </DialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRenameSubmit()}
            placeholder="Trip name"
          />
          <DialogFooter className="gap-2">
            <button
              type="button"
              onClick={() => setRenameOpen(false)}
              className="px-4 py-2 text-sm rounded-md hover:bg-accent"
            >
              Cancel
            </button>
            <PrimaryGrowButton size="sm" onClick={handleRenameSubmit}>
              Save
            </PrimaryGrowButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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
  const { resetNewTrip } = useNewTrip() ?? {};
  const { theme, setTheme } = useTheme();
  const tripsContext = useTripsOptional();
  const allTrips = tripsContext?.trips ?? [];
  const trips = allTrips.filter((t) => !t.archived).sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1));
  const archivedTrips = allTrips.filter((t) => t.archived);
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
              <Link
                href="/"
                onClick={() => {
                  resetNewTrip?.();
                  onLinkClick?.();
                }}
                className="flex items-center min-w-0 shrink-0 font-departure-mono text-base font-semibold"
              >
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
            <Link
              href="/"
              onClick={() => {
                resetNewTrip?.();
                onLinkClick?.();
              }}
              title={isCollapsed ? "New Trip" : undefined}
            >
              <MapPinPlus className="h-4 w-4 shrink-0" />
              {!isCollapsed && "New Trip"}
            </Link>
          </PrimaryGrowButton>

          <PrimaryGrowButton
            className={cn(
              "font-departure-mono text-sm",
              isCollapsed ? "justify-center px-0 w-full" : "justify-start gap-3"
            )}
            asChild
          >
            <Link href="/passport" onClick={onLinkClick} title={isCollapsed ? "Passport" : undefined}>
              <PassportIcon className="h-4 w-4 shrink-0" />
              {!isCollapsed && "Passport"}
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
            {trips.length === 0 && archivedTrips.length === 0 ? (
              <span className="font-departure-mono text-xs text-muted-foreground py-1">No trips yet</span>
            ) : (
              <>
                {trips.map((trip) => (
                  <div key={trip.id} className="relative">
                    <TripItem
                      trip={trip}
                      onLinkClick={onLinkClick}
                      updateTrip={tripsContext?.updateTrip ?? (() => null)}
                      removeTrip={tripsContext?.removeTrip ?? (() => false)}
                    />
                  </div>
                ))}
                {archivedTrips.length > 0 && tripsContext && (
                  <>
                    <span className="font-departure-mono text-xs text-muted-foreground py-1 mt-2">Archived</span>
                    {archivedTrips.map((trip) => (
                      <div key={trip.id} className="relative">
                        <TripItem
                          trip={trip}
                          onLinkClick={onLinkClick}
                          updateTrip={tripsContext.updateTrip}
                          removeTrip={tripsContext.removeTrip}
                        />
                      </div>
                    ))}
                  </>
                )}
              </>
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
                <Settings className="h-4 w-4 shrink-0" />
                Settings
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
                    <Settings className="h-4 w-4 shrink-0" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <ThemeRadioGroup theme={theme} setTheme={setTheme} />
                </DropdownMenuContent>
              </DropdownMenu>
            <SecondaryGrowButton size="sm" className="w-full font-departure-mono justify-start px-4" asChild>
              <Link
          href="/"
          onClick={() => {
            resetNewTrip?.();
            onLinkClick?.();
          }}
          className="flex items-center"
        >
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
  const { resetNewTrip } = useNewTrip() ?? {};

  return (
    <>
      <aside
        className="fixed left-0 top-0 z-40 h-screen border-r bg-card font-departure-mono flex flex-col overflow-hidden hidden md:flex transition-[width] duration-200 ease-out"
        style={{ width: sidebarWidth }}
      >
        <SidebarContent onOpenSettings={() => setSettingsOpen(true)} />
      </aside>

      <div className="fixed left-0 top-0 z-40 flex md:hidden items-center gap-2 p-2">
        <Link href="/" onClick={() => resetNewTrip?.()} className="shrink-0">
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
