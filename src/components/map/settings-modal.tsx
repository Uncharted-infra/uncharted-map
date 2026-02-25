"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Plane, Coins, Plug, Bell, ChevronDown, Check } from "lucide-react";
import { PassportIcon } from "@/components/icons/passport-icon";
import { cn } from "@/lib/utils";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Republic of the)", "Costa Rica", "Côte d'Ivoire", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "São Tomé and Príncipe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Türkiye", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe",
];

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

  const passwordValid = !password || PASSWORD_REGEX.test(password);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden flex flex-col [&>button]:right-4 [&>button]:top-4 [&>button]:z-10">
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
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="font-departure-mono">Account</CardTitle>
                    <CardDescription className="font-wenkai-mono-bold">Manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Name</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Input id="first-name" placeholder="First name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                        <Input id="last-name" placeholder="Last name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Country of Residence</Label>
                      <Popover open={baseCountryOpen} onOpenChange={setBaseCountryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-wenkai-mono-bold h-9"
                          >
                            {baseCountry ?? "Select country"}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
                          align="start"
                          onWheel={(e) => e.stopPropagation()}
                          onTouchMove={(e) => e.stopPropagation()}
                        >
                          <div className="max-h-[320px] overflow-y-auto overscroll-contain min-h-0">
                            <div className="p-2">
                              {COUNTRIES.map((country) => (
                                <button
                                  key={country}
                                  type="button"
                                  onClick={() => {
                                    setBaseCountry(country);
                                    setBaseCountryOpen(false);
                                  }}
                                  className={cn(
                                    "w-full text-left px-3 py-2 rounded-md text-sm transition-colors font-wenkai-mono-bold",
                                    "hover:bg-accent focus:bg-accent focus:outline-none",
                                    baseCountry === country && "bg-accent"
                                  )}
                                >
                                  {country}
                                </button>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="font-wenkai-mono-bold">Email</Label>
                      <Input id="email" type="email" placeholder="you@example.com" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="font-wenkai-mono-bold">Password</Label>
                      <p className="text-xs text-muted-foreground font-wenkai-mono-bold whitespace-nowrap">
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
                        <p className="text-xs text-destructive font-wenkai-mono-bold">Password does not meet requirements</p>
                      )}
                      {passwordValid && password && (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-500">
                          <Check className="h-4 w-4 shrink-0" />
                          <span className="text-xs font-wenkai-mono-bold" title="password is good to go!">
                            password is good to go!
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Personality</Label>
                      <p className="text-xs text-muted-foreground font-wenkai-mono-bold whitespace-nowrap">MBTI type – acronym and description</p>
                      <Popover open={personalityOpen} onOpenChange={setPersonalityOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-wenkai-mono-bold h-auto min-h-9 py-2"
                          >
                            {personality ? (
                              <Badge variant="secondary" className="font-wenkai-mono-bold">
                                {personality.id} – {personality.title}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Select personality type</span>
                            )}
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-[var(--radix-popover-trigger-width)] max-h-[320px] p-0 overflow-hidden"
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
                                    {group.items.map((item) => (
                                      <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                          setPersonality({ id: item.id, title: item.title });
                                          setPersonalityOpen(false);
                                        }}
                                        className={cn(
                                          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                                          "hover:bg-accent focus:bg-accent focus:outline-none",
                                          personality?.id === item.id && "bg-accent"
                                        )}
                                      >
                                        <span className="font-departure-mono font-medium">
                                          {item.id} – {item.title}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-0.5 font-wenkai-mono-bold">
                                          {item.desc}
                                        </p>
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button variant="destructive" size="sm">Delete account</Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "travel" && (
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="font-departure-mono">Travel Preferences</CardTitle>
                    <CardDescription className="font-wenkai-mono-bold">Customize how Map plans your trips</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Preferred airports</Label>
                      <Input placeholder="e.g. JFK, LGA, EWR" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Seat class</Label>
                      <Input placeholder="Economy / Business / First" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Hotel level</Label>
                      <Input placeholder="Budget / Standard / Luxury" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Dietary restrictions</Label>
                      <Input placeholder="e.g. Vegetarian, Gluten-free" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Accessibility needs</Label>
                      <Input placeholder="Any accessibility requirements" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Favorite airlines</Label>
                      <Input placeholder="e.g. Delta, United" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-wenkai-mono-bold">Favorite hotel chains</Label>
                      <Input placeholder="e.g. Marriott, Hilton" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "maps" && (
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="font-departure-mono">Maps (Token Usage)</CardTitle>
                    <CardDescription className="font-wenkai-mono-bold">Your daily maps allowance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-wenkai-mono-bold">Daily maps remaining</span>
                      <span className="font-wenkai-mono-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-wenkai-mono-bold">Refill date</span>
                      <span className="font-wenkai-mono-bold">Tomorrow</span>
                    </div>
                    <Button>Upgrade plan</Button>
                  </CardContent>
                </Card>
              )}

              {activeTab === "integrations" && (
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="font-departure-mono">Integrations</CardTitle>
                    <CardDescription className="font-wenkai-mono-bold">Connect your accounts to import reservations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium font-wenkai-mono-bold">Gmail / Outlook</p>
                        <p className="text-sm text-muted-foreground font-wenkai-mono-bold">Import reservations from email</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium font-wenkai-mono-bold">Calendar sync</p>
                        <p className="text-sm text-muted-foreground font-wenkai-mono-bold">Sync trips to your calendar</p>
                      </div>
                      <Button variant="outline" size="sm">Connect</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between opacity-60">
                      <div>
                        <p className="font-medium font-wenkai-mono-bold">WhatsApp</p>
                        <p className="text-sm text-muted-foreground font-wenkai-mono-bold">Future agent messaging</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Coming soon</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between opacity-60">
                      <div>
                        <p className="font-medium font-wenkai-mono-bold">iMessage</p>
                        <p className="text-sm text-muted-foreground font-wenkai-mono-bold">Future agent messaging</p>
                      </div>
                      <Button variant="outline" size="sm" disabled>Coming soon</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "notifications" && (
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="font-departure-mono">Notifications</CardTitle>
                    <CardDescription className="font-wenkai-mono-bold">Choose what you want to be notified about</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="booking" className="font-wenkai-mono-bold">Booking confirmations</Label>
                      <Switch id="booking" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price" className="font-wenkai-mono-bold">Price drops</Label>
                      <Switch id="price" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="itinerary" className="font-wenkai-mono-bold">Itinerary changes</Label>
                      <Switch id="itinerary" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reminders" className="font-wenkai-mono-bold">Travel reminders</Label>
                      <Switch id="reminders" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
