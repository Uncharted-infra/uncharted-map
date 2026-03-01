"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
} from "react-simple-maps";
import { cn } from "@/lib/utils";
import { COUNTRY_ISO_TO_NAME } from "@/data/globe-countries";
import { COUNTRY_CENTROIDS } from "@/data/globe-country-centroids";

const GEO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function getCountryName(geo: { id?: string; properties?: Record<string, unknown> }): string {
  const propsName = geo.properties?.name;
  if (typeof propsName === "string" && propsName) return propsName;
  const isoCode = geo.id;
  if (isoCode && COUNTRY_ISO_TO_NAME[isoCode]) return COUNTRY_ISO_TO_NAME[isoCode];
  return isoCode ?? "Unknown";
}

const DRAG_THRESHOLD_PX = 5;

export function ExploreGlobe({
  className,
  highlightedCountry,
  centerOnCountry,
  onCountrySelect,
}: {
  className?: string;
  highlightedCountry?: string | null;
  centerOnCountry?: string | null;
  onCountrySelect?: (country: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [rotation, setRotation] = useState<[number, number, number]>([-10, -20, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const lastPosition = useRef({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const potentialSelectedRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  isDraggingRef.current = isDragging;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotate globe to center on country when user selects from dropdown or types full name
  useEffect(() => {
    if (!centerOnCountry) return;
    const centroid = COUNTRY_CENTROIDS[centerOnCountry];
    if (!centroid) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const [lon, lat] = centroid;
    const targetRotation: [number, number, number] = [-lon, -lat, 0];

    const startRotation: [number, number, number] = [...rotation];
    const duration = 800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic

      setRotation([
        startRotation[0] + (targetRotation[0] - startRotation[0]) * eased,
        startRotation[1] + (targetRotation[1] - startRotation[1]) * eased,
        0,
      ]);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [centerOnCountry]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsDragging(true);
    setHoveredCountry(null);
    lastPosition.current = { x: e.clientX, y: e.clientY };
    dragStart.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (hoveredCountry && !isDraggingRef.current) setTooltipPos({ x: e.clientX, y: e.clientY });
      if (!isDragging) return;
      const deltaX = e.clientX - lastPosition.current.x;
      const deltaY = e.clientY - lastPosition.current.y;
      lastPosition.current = { x: e.clientX, y: e.clientY };
      setRotation(([lon, lat]) => [
        lon - deltaX / 2,
        Math.max(-90, Math.min(90, lat + deltaY / 2)),
        0,
      ]);
    },
    [isDragging, hoveredCountry]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    const dx = lastPosition.current.x - dragStart.current.x;
    const dy = lastPosition.current.y - dragStart.current.y;
    const moved = Math.sqrt(dx * dx + dy * dy);
    if (moved < DRAG_THRESHOLD_PX && potentialSelectedRef.current) {
      const country = potentialSelectedRef.current;
      const isDeselecting = selectedCountry === country;
      setSelectedCountry((prev) => (prev === country ? null : country));
      onCountrySelect?.(isDeselecting ? "" : country);
    }
    potentialSelectedRef.current = null;
    setIsDragging(false);
  }, [isDragging, selectedCountry, onCountrySelect]);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
    setHoveredCountry(null);
    potentialSelectedRef.current = null;
  }, []);

  const handleGeographyMouseDown = useCallback(
    (geo: { id?: string; properties?: Record<string, unknown> }) => {
      potentialSelectedRef.current = getCountryName(geo);
    },
    []
  );

  const handleGeographyMouseEnter = useCallback(
    (geo: { id?: string; properties?: Record<string, unknown> }, evt: React.MouseEvent) => {
      if (isDraggingRef.current) return;
      setHoveredCountry(getCountryName(geo));
      setTooltipPos({ x: evt.clientX, y: evt.clientY });
    },
    []
  );

  const handleGeographyMouseLeave = useCallback(() => {
    setHoveredCountry(null);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg min-h-[300px]",
          className
        )}
      >
        <div className="animate-pulse rounded-full bg-muted/30 w-64 h-64" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg",
        isDragging && "cursor-grabbing",
        !isDragging && "cursor-grab",
        className
      )}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <ComposableMap
        projection="geoOrthographic"
        projectionConfig={{
          rotate: rotation,
          scale: 220,
        }}
        className="w-full h-full"
        style={{ width: "100%", height: "100%", maxHeight: "min(70vh, 500px)" }}
      >
        <Sphere
          id="sphere"
          fill="hsl(0 0% 14.9% / 0.3)"
          stroke="hsl(0 0% 14.9% / 0.5)"
          strokeWidth={0.5}
        />
        <Graticule
          stroke="hsl(0 0% 14.9% / 0.3)"
          strokeWidth={0.3}
        />
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = getCountryName(geo);
              const isHighlighted =
                highlightedCountry === name || (!highlightedCountry && selectedCountry === name);
              const baseFill = isHighlighted
                ? "hsl(var(--globe-highlight))"
                : "hsl(0 0% 14.9% / 0.6)";
              const strokeColor = isHighlighted
                ? "hsl(var(--globe-highlight))"
                : "hsl(0 0% 14.9% / 0.6)";
              const hoverFill = isHighlighted
                ? "hsl(var(--globe-highlight-hover))"
                : "hsl(0 0% 14.9%)";
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={baseFill}
                  stroke={strokeColor}
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: isDragging
                      ? { fill: baseFill, outline: "none" }
                      : {
                          fill: hoverFill,
                          outline: "none",
                          cursor: "pointer",
                        },
                    pressed: { outline: "none" },
                  }}
                  onMouseDown={() => handleGeographyMouseDown(geo)}
                  onMouseEnter={(evt) => handleGeographyMouseEnter(geo, evt)}
                  onMouseLeave={handleGeographyMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
      {hoveredCountry && (() => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return null;
        return (
          <div
            className="pointer-events-none absolute z-50 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium shadow-md whitespace-nowrap"
            style={{
              left: tooltipPos.x - rect.left + 12,
              top: tooltipPos.y - rect.top + 12,
            }}
          >
            {hoveredCountry}
          </div>
        );
      })()}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground font-departure-mono">
        Drag to rotate · Click to select
      </p>
    </div>
  );
}
