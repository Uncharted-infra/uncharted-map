"use client";

import { MapPin, Plane, Hotel, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DestinationCard({
  name,
  overview,
  bestTime,
  imageUrl,
}: {
  name: string;
  overview: string;
  bestTime: string;
  imageUrl?: string;
}) {
  return (
    <Card className="overflow-hidden animate-fade-slide-up">
      <div className="aspect-video bg-muted relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <MapPin className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <h3 className="font-departure-mono font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground">{overview}</p>
        <p className="font-wenkai-mono-bold text-xs text-muted-foreground">Best time: {bestTime}</p>
      </CardHeader>
      <CardFooter className="gap-2">
        <Button size="sm">Plan Trip</Button>
        <Button size="sm" variant="outline">Save</Button>
        <Button size="sm" variant="ghost">Compare</Button>
      </CardFooter>
    </Card>
  );
}

export function FlightOptionCard({
  airline,
  departure,
  arrival,
  price,
}: {
  airline: string;
  departure: string;
  arrival: string;
  price: string;
}) {
  return (
    <Card className="animate-fade-slide-up">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <span className="font-wenkai-mono-bold font-medium">{airline}</span>
          </div>
          <span className="font-wenkai-mono-bold font-semibold">{price}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {departure} → {arrival}
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">Select</Button>
      </CardFooter>
    </Card>
  );
}

export function HotelCard({
  name,
  rating,
  location,
  amenities,
}: {
  name: string;
  rating: number;
  location: string;
  amenities: string[];
}) {
  return (
    <Card className="animate-fade-slide-up">
      <div className="aspect-video bg-muted flex items-center justify-center">
        <Hotel className="h-12 w-12 text-muted-foreground" />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="font-departure-mono font-semibold">{name}</h3>
          <Badge variant="secondary">{rating}/5</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{location}</p>
        <p className="text-xs text-muted-foreground">{amenities.join(" · ")}</p>
      </CardHeader>
      <CardFooter>
        <Button size="sm" className="w-full">Reserve</Button>
      </CardFooter>
    </Card>
  );
}

export function ActivityCard({
  name,
  description,
  duration,
  timeslots,
}: {
  name: string;
  description: string;
  duration: string;
  timeslots: string[];
}) {
  return (
    <Card className="animate-fade-slide-up">
      <CardContent className="pt-4">
        <h3 className="font-departure-mono font-semibold">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <p className="font-wenkai-mono-bold text-xs mt-2">{duration}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {timeslots.map((slot) => (
            <Badge key={slot} variant="outline" className="text-xs">
              {slot}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button size="sm" className="w-full">Book</Button>
      </CardFooter>
    </Card>
  );
}

export function ItineraryDayCard({
  dayTitle,
  activities,
}: {
  dayTitle: string;
  activities: { time: string; title: string }[];
}) {
  return (
    <Card className="animate-fade-slide-up">
      <CardHeader className="pb-2">
        <CardTitle className="font-departure-mono text-sm">{dayTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {activities.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="font-wenkai-mono-bold text-muted-foreground shrink-0">{a.time}</span>
              <span>{a.title}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function ConfirmationCard({
  reservationNumber,
  date,
}: {
  reservationNumber: string;
  date: string;
}) {
  return (
    <Card className="border-green-200 dark:border-green-900 animate-fade-slide-up">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="font-semibold">Confirmed</span>
        </div>
        <p className="font-wenkai-mono-bold text-sm mt-2">#{reservationNumber}</p>
        <p className="text-sm text-muted-foreground">{date}</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button size="sm" variant="outline">Add to calendar</Button>
        <Button size="sm" variant="outline">Download PDF</Button>
      </CardFooter>
    </Card>
  );
}
