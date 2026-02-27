"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PrimaryGrowButton, SecondaryGrowButton, DestructiveGrowButton } from "@/components/ui/grow-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Plane, Coins, Plug, Bell, ChevronDown, Check, Save, Trash2 } from "lucide-react";
import { PassportIcon } from "@/components/icons/passport-icon";
import { cn } from "@/lib/utils";
import { COUNTRIES, COUNTRY_PHONE_FORMATS, DEFAULT_PHONE_SEGMENTS } from "@/data/countries";
import { TRAVEL_FIELDS, INTEGRATIONS, NOTIFICATION_ITEMS } from "@/data/settings";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const PERSONALITY_OPTIONS = [
  { group: "🧠 Analysts", items: [
    { id: "INTJ", title: "Architect", desc: "Plans a hyper-efficient, optimized itinerary months in advance and quietly experiences each destination with strategic precision." },
    { id: "INTP", title: "Logician", desc: "Spends half the trip researching the history, culture, and philosophy of the place and the other half wandering thoughtfully off-schedule." },
    { id: "ENTJ", title: "Commander", desc: "Turns the group trip into a flawlessly executed global operation with bookings, backup plans, and ambitious goals." },
    { id: "ENTP", title: "Debater", desc: "Books the trip last minute, befriends strangers immediately, and somehow ends up at the most unexpected underground event." },
  ]},
  { group: "💛 Diplomats", items: [
    { id: "INFJ", title: "Advocate", desc: "Seeks deeply meaningful cultural experiences and hidden spots that feel authentic and transformative." },
    { id: "INFP", title: "Mediator", desc: "Wanders poetic streets, journals in cafés, and chases emotional, soul-stirring moments over tourist checklists." },
    { id: "ENFJ", title: "Protagonist", desc: "Curates experiences everyone will love and connects deeply with locals wherever they go." },
    { id: "ENFP", title: "Campaigner", desc: "Travels with boundless excitement, says yes to everything, and collects spontaneous stories in every city." },
  ]},
  { group: "🛡 Sentinels", items: [
    { id: "ISTJ", title: "Logistician", desc: "Researches thoroughly, follows a structured plan, and ensures nothing important gets missed." },
    { id: "ISFJ", title: "Defender", desc: "Prioritizes comfort, thoughtful planning, and making sure everyone feels safe and happy." },
    { id: "ESTJ", title: "Executive", desc: "Keeps the group organized, on schedule, and maximizing every single day abroad." },
    { id: "ESFJ", title: "Consul", desc: "Builds warm connections everywhere and turns every trip into a shared memory event." },
  ]},
  { group: "🎨 Explorers", items: [
    { id: "ISTP", title: "Virtuoso", desc: "Explores independently, tries adventurous activities, and figures things out on the fly." },
    { id: "ISFP", title: "Adventurer", desc: "Soaks in beautiful scenery, local art, and sensory experiences with quiet appreciation." },
    { id: "ESTP", title: "Entrepreneur", desc: "Seeks thrill, nightlife, action sports, and bold experiences wherever they land." },
    { id: "ESFP", title: "Entertainer", desc: "Finds the party, makes new friends instantly, and lives fully in every moment of the trip." },
  ]},
];

type SettingsTab = "account" | "travel" | "maps" | "integrations" | "notifications";

const TABS: { id: SettingsTab; label: string; icon: typeof User }[] = [
  { id: "account", label: "Account", icon: User },
  { id: "travel", label: "Travel Preferences", icon: Plane },
  { id: "maps", label: "Token Usage", icon: Coins },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "notifications", label: "Notifications", icon: Bell },
];

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [personality, setPersonality] = useState<{ id: string; title: string } | null>(null);
  const [password, setPassword] = useState("");
  const [personalityOpen, setPersonalityOpen] = useState(false);
  const [baseCountry, setBaseCountry] = useState<string | null>(null);
  const [baseCountryOpen, setBaseCountryOpen] = useState(false);
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneParts, setPhoneParts] = useState<string[]>([]);

  const phoneSegments = baseCountry && COUNTRY_PHONE_FORMATS[baseCountry]
    ? COUNTRY_PHONE_FORMATS[baseCountry].segments
    : DEFAULT_PHONE_SEGMENTS;

  useEffect(() => {
    const fmt = baseCountry && COUNTRY_PHONE_FORMATS[baseCountry];
    if (fmt) {
      setPhoneCode(fmt.code);
      setPhoneParts(fmt.segments.map(() => ""));
    }
  }, [baseCountry]);

  const setPhonePart = (index: number, value: string) => {
    setPhoneParts((prev) => {
      const next = [...(prev.length >= phoneSegments.length ? prev : phoneSegments.map(() => ""))];
      next[index] = value.replace(/\D/g, "").slice(0, phoneSegments[index]);
      return next;
    });
  };

  const passwordValid = !password || PASSWORD_REGEX.test(password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col [&>button]:right-4 [&>button]:top-4 [&>button]:z-10"
        overlayClassName="left-1/2 top-1/2 right-auto bottom-auto w-[95vw] max-w-6xl h-[90vh] -translate-x-1/2 -translate-y-1/2"
      >
        <DialogTitle className="sr-only">Passport</DialogTitle>
        <div className="relative flex-1 min-h-0 flex overflow-hidden">
          <aside className="absolute left-0 top-0 bottom-0 z-10 w-[240px] flex flex-col border-r-2 border-border bg-muted/40">
            <div className="shrink-0 p-3 border-b-2 border-border flex items-center">
              <h2 className="font-departure-mono text-lg font-semibold">Passport</h2>
              <PassportIcon className="h-5 w-5 shrink-0 ml-[100px]" />
            </div>
            <nav className="flex-1 overflow-y-auto py-2 min-h-0">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors font-departure-mono whitespace-nowrap text-left",
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <ScrollArea className="flex-1 min-w-0 pl-[240px]">
            <div className="p-6 pt-14">
              {activeTab === "account" && (
                <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Name</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input id="first-name" placeholder="First name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                        <Input id="last-name" placeholder="Last name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="font-departure-mono">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="font-departure-mono">Password</Label>
                      <p className="text-xs text-muted-foreground font-departure-mono whitespace-nowrap">
                        min 8 characters, 1 upper/lowercase, 1 special character
                      </p>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={cn(
                          "font-wenkai-mono-bold placeholder:font-wenkai-mono-bold",
                          !passwordValid && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {!passwordValid && password && (
                        <p className="text-xs text-destructive font-departure-mono">Password does not meet requirements</p>
                      )}
                      {passwordValid && password && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                          <Check className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-departure-mono" title="password is good to go!">
                            password is good to go!
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Country of Residence</Label>
                      <Popover open={baseCountryOpen} onOpenChange={setBaseCountryOpen}>
                        <PopoverTrigger asChild>
                          <SecondaryGrowButton
                            className="w-full justify-between font-wenkai-mono-bold h-9"
                          >
                            {baseCountry ?? "Select country"}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </SecondaryGrowButton>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
                          side="bottom"
                          align="start"
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                        >
                          <div className="max-h-[320px] overflow-y-auto overscroll-contain min-h-0">
                            <div className="p-2">
                              {COUNTRIES.map((country) => {
                                const isSelected = baseCountry === country;
                                return (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                      setBaseCountry(country);
                                      setBaseCountryOpen(false);
                                    }}
                                    className={cn(
                                      "w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-wenkai-mono-bold",
                                      "focus:outline-none",
                                      isSelected
                                        ? "bg-accent shadow-md"
                                        : "hover:bg-muted focus:bg-muted"
                                    )}
                                  >
                                    {country}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Phone number</Label>
                      <div className="flex flex-wrap gap-2 items-center">
                        <Input
                          value={phoneCode}
                          onChange={(e) => setPhoneCode(e.target.value)}
                          placeholder="+1"
                          className="w-24 font-wenkai-mono-bold placeholder:font-wenkai-mono-bold shrink-0"
                        />
                        {phoneSegments.map((len, i) => (
                          <Input
                            key={i}
                            value={phoneParts[i] ?? ""}
                            onChange={(e) => setPhonePart(i, e.target.value)}
                            placeholder={"X".repeat(len)}
                            type="tel"
                            maxLength={len}
                            className={cn(
                              "font-wenkai-mono-bold placeholder:font-wenkai-mono-bold text-center",
                              len <= 2 ? "w-10" : len <= 4 ? "w-14" : len <= 5 ? "w-16" : "w-20"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-departure-mono">Personality</Label>
                      <p className="text-xs text-muted-foreground font-departure-mono whitespace-nowrap">MBTI type – acronym and description</p>
                      <Popover open={personalityOpen} onOpenChange={setPersonalityOpen}>
                        <PopoverTrigger asChild>
                          <SecondaryGrowButton
                            className="w-full justify-between font-departure-mono h-auto min-h-9 py-2"
                          >
                            {personality ? (
                              <Badge variant="secondary" className="font-departure-mono">
                                {personality.id} – {personality.title}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Select personality type</span>
                            )}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </SecondaryGrowButton>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
                            side="bottom"
                            align="start"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                          >
                          <div className="max-h-[320px] overflow-y-auto overscroll-contain min-h-0">
                            <div className="p-2 space-y-4">
                              {PERSONALITY_OPTIONS.map((group) => (
                                <div key={group.group}>
                                  <p className="px-2 py-1 text-xs font-departure-mono font-semibold text-muted-foreground">
                                    {group.group}
                                  </p>
                                  <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isSelected = personality?.id === item.id;
                                        return (
                                          <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                              setPersonality({ id: item.id, title: item.title });
                                              setPersonalityOpen(false);
                                            }}
                                            className={cn(
                                              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors focus:outline-none",
                                              isSelected && "bg-accent shadow-md"
                                            )}
                                          >
                                        <span className="font-departure-mono font-medium">
                                          {item.id} – {item.title}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-departure-mono">
                                          {item.desc}
                                        </p>
                                      </button>
                                        );
                                      })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                    <PrimaryGrowButton size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      <Save className="h-4 w-4 shrink-0" />
                      Save
                    </PrimaryGrowButton>
                    <DestructiveGrowButton size="sm">
                      <Trash2 className="h-4 w-4 shrink-0" />
                      Delete account
                    </DestructiveGrowButton>
                  </div>
                </div>
              )}

              {activeTab === "travel" && (
                <div className="space-y-4">
                  {TRAVEL_FIELDS.map(({ label, placeholder }) => (
                    <div key={label} className="space-y-1.5">
                      <Label className="font-departure-mono">{label}</Label>
                      <Input placeholder={placeholder} className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "maps" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-departure-mono">Daily maps remaining</span>
                      <span className="font-departure-mono">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-departure-mono">Refill date</span>
                      <span className="font-departure-mono">Tomorrow</span>
                    </div>
                    <PrimaryGrowButton>Upgrade plan</PrimaryGrowButton>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="space-y-4">
                  {INTEGRATIONS.map((item, i) => (
                    <div key={item.name}>
                      {i > 0 && <Separator />}
                      <div className={cn("flex items-center justify-between", item.disabled && "opacity-60")}>
                        <div>
                          <p className="font-medium font-departure-mono">{item.name}</p>
                          <p className="text-sm text-muted-foreground font-departure-mono">{item.desc}</p>
                        </div>
                        <SecondaryGrowButton size="sm" disabled={item.disabled}>
                          {item.disabled ? "Coming soon" : "Connect"}
                        </SecondaryGrowButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-4">
                  {NOTIFICATION_ITEMS.map(({ id, label }) => (
                    <div key={id} className="flex items-center justify-between">
                      <Label htmlFor={id} className="font-departure-mono">{label}</Label>
                      <Switch id={id} defaultChecked />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
