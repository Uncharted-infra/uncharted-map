"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="font-fenix text-2xl font-semibold mb-8">Settings</h1>
      <div className="max-w-2xl space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-departure-mono">Account</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" />
              </div>
              <Button variant="destructive" size="sm">Delete account</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-departure-mono">Travel Preferences</CardTitle>
              <CardDescription>Customize how Map plans your trips</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred airports</Label>
                <Input placeholder="e.g. JFK, LGA, EWR" />
              </div>
              <div className="space-y-2">
                <Label>Seat class</Label>
                <Input placeholder="Economy / Business / First" />
              </div>
              <div className="space-y-2">
                <Label>Hotel level</Label>
                <Input placeholder="Budget / Standard / Luxury" />
              </div>
              <div className="space-y-2">
                <Label>Dietary restrictions</Label>
                <Input placeholder="e.g. Vegetarian, Gluten-free" />
              </div>
              <div className="space-y-2">
                <Label>Accessibility needs</Label>
                <Input placeholder="Any accessibility requirements" />
              </div>
              <div className="space-y-2">
                <Label>Favorite airlines</Label>
                <Input placeholder="e.g. Delta, United" />
              </div>
              <div className="space-y-2">
                <Label>Favorite hotel chains</Label>
                <Input placeholder="e.g. Marriott, Hilton" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-departure-mono">Maps (Token Usage)</CardTitle>
              <CardDescription>Your daily maps allowance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Daily maps remaining</span>
                <span className="font-departure-mono">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Refill date</span>
                <span className="font-departure-mono">Tomorrow</span>
              </div>
              <Button>Upgrade plan</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-departure-mono">Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="booking">Booking confirmations</Label>
                <Switch id="booking" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="price">Price drops</Label>
                <Switch id="price" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="itinerary">Itinerary changes</Label>
                <Switch id="itinerary" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="reminders">Travel reminders</Label>
                <Switch id="reminders" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-departure-mono">Integrations</CardTitle>
              <CardDescription>Connect your accounts to import reservations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Gmail / Outlook</p>
                  <p className="text-sm text-muted-foreground">Import reservations from email</p>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Calendar sync</p>
                  <p className="text-sm text-muted-foreground">Sync trips to your calendar</p>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Future agent messaging</p>
                </div>
                <Button variant="outline" size="sm" disabled>Coming soon</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between opacity-60">
                <div>
                  <p className="font-medium">iMessage</p>
                  <p className="text-sm text-muted-foreground">Future agent messaging</p>
                </div>
                <Button variant="outline" size="sm" disabled>Coming soon</Button>
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
