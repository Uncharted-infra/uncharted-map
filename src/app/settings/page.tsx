"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] p-6">
      <h1 className="font-departure-mono text-2xl font-semibold mb-6">Settings</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-6xl">
        <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-departure-mono">Account</CardTitle>
              <CardDescription className="font-wenkai-mono-bold">Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-wenkai-mono-bold">Name</Label>
                <Input id="name" placeholder="Your name" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-wenkai-mono-bold">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-wenkai-mono-bold">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <Button variant="destructive" size="sm">Delete account</Button>
            </CardContent>
        </Card>

        <Card className="h-fit">
            <CardHeader>
              <CardTitle className="font-departure-mono">Travel Preferences</CardTitle>
              <CardDescription className="font-wenkai-mono-bold">Customize how Map plans your trips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Preferred airports</Label>
                <Input placeholder="e.g. JFK, LGA, EWR" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Seat class</Label>
                <Input placeholder="Economy / Business / First" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Hotel level</Label>
                <Input placeholder="Budget / Standard / Luxury" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Dietary restrictions</Label>
                <Input placeholder="e.g. Vegetarian, Gluten-free" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Accessibility needs</Label>
                <Input placeholder="Any accessibility requirements" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Favorite airlines</Label>
                <Input placeholder="e.g. Delta, United" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
              <div className="space-y-2">
                <Label className="font-wenkai-mono-bold">Favorite hotel chains</Label>
                <Input placeholder="e.g. Marriott, Hilton" className="font-wenkai-mono-bold placeholder:font-wenkai-mono-bold" />
              </div>
            </CardContent>
        </Card>

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

        <Card className="h-fit lg:col-span-2">
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
      </div>
    </div>
  );
}
