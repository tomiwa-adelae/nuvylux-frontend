// app/(root)/_components/ServiceFilters.tsx
"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  IconSearch,
  IconMapPin,
  IconX,
  IconLoader2,
  IconChevronDown,
  IconCurrentLocation,
  IconAdjustmentsHorizontal,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationData } from "@/hooks/useUserLocation";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ServiceFiltersState = {
  search: string;
  type: string; // "" = all
  deliveryMode: string; // "" = all
  priceMin: string;
  priceMax: string;
  radius: string; // km, "" = any
  sortBy: "newest" | "price_asc" | "price_desc" | "distance";
};

export const DEFAULT_FILTERS: ServiceFiltersState = {
  search: "",
  type: "",
  deliveryMode: "",
  priceMin: "",
  priceMax: "",
  radius: "",
  sortBy: "newest",
};

type Props = {
  filters: ServiceFiltersState;
  onChange: (filters: ServiceFiltersState) => void;
  location: LocationData;
  onRefreshLocation: () => void;
  onManualLocation: (city: string, state: string, country: string) => void;
  resultCount: number;
  loading: boolean;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { label: "All Types", value: "" },
  { label: "Consultation", value: "CONSULTATION" },
  { label: "Deliverable", value: "DELIVERABLE" },
  { label: "Project", value: "PROJECT" },
];

const MODE_OPTIONS = [
  { label: "All Modes", value: "" },
  { label: "Online", value: "ONLINE" },
  { label: "In-Person", value: "IN_PERSON" },
  { label: "Hybrid", value: "HYBRID" },
];

const RADIUS_OPTIONS = [
  { label: "Any distance", value: "" },
  { label: "Within 5 km", value: "5" },
  { label: "Within 10 km", value: "10" },
  { label: "Within 25 km", value: "25" },
  { label: "Within 50 km", value: "50" },
  { label: "Within 100 km", value: "100" },
];

// ─── Location pill ───────────────────────────────────────────────────────────

function LocationPill({
  location,
  onRefresh,
  onManual,
}: {
  location: LocationData;
  onRefresh: () => void;
  onManual: (city: string, state: string, country: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const displayName =
    location.city && location.state
      ? `${location.city}, ${location.state}`
      : location.city ?? location.state ?? location.country ?? null;

  const methodIcon =
    location.method === "gps" ? "📍" :
    location.method === "ip" ? "🌐" :
    location.method === "profile" ? "👤" :
    location.method === "manual" ? "✏️" : "📍";

  const methodLabel =
    location.method === "gps" ? "GPS" :
    location.method === "ip" ? "IP" :
    location.method === "profile" ? "Profile" :
    location.method === "manual" ? "Manual" : "";

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    // Parse "City, State" or just "City"
    const parts = draft.split(",").map((p) => p.trim());
    onManual(parts[0] ?? "", parts[1] ?? "", parts[2] ?? "");
    setEditing(false);
    setDraft("");
  }

  if (editing) {
    return (
      <form onSubmit={handleManualSubmit} className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="City, State (e.g. Lagos, Lagos)"
          className="h-8 text-sm w-52"
        />
        <Button type="submit" size="sm" className="h-8 px-3 text-xs">
          Set
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => setEditing(false)}
        >
          <IconX size={14} />
        </Button>
      </form>
    );
  }

  if (location.loading) {
    return (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground px-3 py-1.5 rounded-full border border-dashed">
        <IconLoader2 size={14} className="animate-spin" />
        <span>Detecting location…</span>
      </div>
    );
  }

  if (!displayName) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary px-3 py-1.5 rounded-full border border-dashed hover:border-primary transition-colors"
      >
        <IconMapPin size={14} />
        <span>Set location</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div
        title={`Detected via ${methodLabel}`}
        className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 text-primary"
      >
        <IconMapPin size={14} className="shrink-0" />
        <span className="max-w-[160px] truncate">{displayName}</span>
        <span className="text-[10px] text-muted-foreground ml-0.5 font-normal">
          ({methodLabel})
        </span>
      </div>
      <button
        type="button"
        title="Change location"
        onClick={() => setEditing(true)}
        className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
      >
        <IconCurrentLocation size={14} />
      </button>
      <button
        type="button"
        title="Refresh location"
        onClick={onRefresh}
        className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
      >
        <IconRefresh size={14} />
      </button>
    </div>
  );
}

// ─── Pill group (type / mode) ─────────────────────────────────────────────────

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border transition-all",
            value === opt.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent border-border text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Active filters chips ─────────────────────────────────────────────────────

function ActiveFilters({
  filters,
  location,
  onRemove,
  onClearAll,
}: {
  filters: ServiceFiltersState;
  location: LocationData;
  onRemove: (key: keyof ServiceFiltersState) => void;
  onClearAll: () => void;
}) {
  const chips: { label: string; key: keyof ServiceFiltersState }[] = [];

  if (filters.search)
    chips.push({ label: `"${filters.search}"`, key: "search" });
  if (filters.type) {
    const found = TYPE_OPTIONS.find((o) => o.value === filters.type);
    chips.push({ label: found?.label ?? filters.type, key: "type" });
  }
  if (filters.deliveryMode) {
    const found = MODE_OPTIONS.find((o) => o.value === filters.deliveryMode);
    chips.push({ label: found?.label ?? filters.deliveryMode, key: "deliveryMode" });
  }
  if (filters.priceMin)
    chips.push({ label: `From ₦${Number(filters.priceMin).toLocaleString()}`, key: "priceMin" });
  if (filters.priceMax)
    chips.push({ label: `Up to ₦${Number(filters.priceMax).toLocaleString()}`, key: "priceMax" });
  if (filters.radius) {
    const found = RADIUS_OPTIONS.find((o) => o.value === filters.radius);
    chips.push({ label: found?.label ?? `${filters.radius}km`, key: "radius" });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-muted-foreground font-medium">Active:</span>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            className="hover:opacity-70 transition-opacity"
          >
            <IconX size={11} />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-muted-foreground hover:text-destructive transition-colors underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function ServiceFilters({
  filters,
  onChange,
  location,
  onRefreshLocation,
  onManualLocation,
  resultCount,
  loading,
}: Props) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Debounced search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  function handleSearchChange(val: string) {
    setLocalSearch(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      onChange({ ...filters, search: val });
    }, 400);
  }

  function set<K extends keyof ServiceFiltersState>(
    key: K,
    value: ServiceFiltersState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  function removeFilter(key: keyof ServiceFiltersState) {
    onChange({ ...filters, [key]: DEFAULT_FILTERS[key] });
  }

  function clearAll() {
    setLocalSearch("");
    onChange(DEFAULT_FILTERS);
  }

  const hasLocation = !!(location.lat || location.city);
  const showRadius =
    (filters.deliveryMode === "IN_PERSON" ||
      filters.deliveryMode === "HYBRID" ||
      filters.deliveryMode === "") &&
    hasLocation;

  return (
    <div className="space-y-4">
      {/* ── Row 1: search + location + sort ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <IconSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search services, skills, or keywords…"
            className="pl-9 h-10"
          />
          {localSearch && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => handleSearchChange("")}
            >
              <IconX size={14} />
            </button>
          )}
        </div>

        {/* Location pill */}
        <LocationPill
          location={location}
          onRefresh={onRefreshLocation}
          onManual={onManualLocation}
        />

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(v) => set("sortBy", v as ServiceFiltersState["sortBy"])}
        >
          <SelectTrigger className="h-10 w-auto min-w-[160px] text-sm">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            {hasLocation && (
              <SelectItem value="distance">Nearest First</SelectItem>
            )}
            <SelectItem value="price_asc">Price: Low → High</SelectItem>
            <SelectItem value="price_desc">Price: High → Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle advanced */}
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors shrink-0",
            showAdvanced
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:border-primary hover:text-primary"
          )}
        >
          <IconAdjustmentsHorizontal size={15} />
          Filters
          {(filters.type ||
            filters.deliveryMode ||
            filters.priceMin ||
            filters.priceMax ||
            filters.radius) && (
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary-foreground text-primary text-[10px] font-bold">
              {
                [
                  filters.type,
                  filters.deliveryMode,
                  filters.priceMin,
                  filters.priceMax,
                  filters.radius,
                ].filter(Boolean).length
              }
            </span>
          )}
        </button>
      </div>

      {/* ── Row 2: quick type pills (always visible) ── */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide shrink-0">
          Type
        </span>
        <PillGroup
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={(v) => set("type", v)}
        />
      </div>

      {/* ── Advanced panel ── */}
      {showAdvanced && (
        <div className="rounded-xl border bg-muted/30 p-4 space-y-5">
          {/* Delivery Mode */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Delivery Mode
            </p>
            <PillGroup
              options={MODE_OPTIONS}
              value={filters.deliveryMode}
              onChange={(v) => set("deliveryMode", v)}
            />
          </div>

          {/* Price range */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Price Range (₦)
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={0}
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => set("priceMin", e.target.value)}
                className="h-9 w-28 text-sm"
              />
              <span className="text-muted-foreground text-sm">—</span>
              <Input
                type="number"
                min={0}
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => set("priceMax", e.target.value)}
                className="h-9 w-28 text-sm"
              />
              {(filters.priceMin || filters.priceMax) && (
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    set("priceMin", "");
                    set("priceMax", "");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Radius (only when we have a location) */}
          {showRadius && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Distance Radius
                {!location.lat && (
                  <span className="ml-2 text-amber-500 font-normal">
                    (coordinates needed for precise radius — searching by city
                    instead)
                  </span>
                )}
              </p>
              <PillGroup
                options={RADIUS_OPTIONS}
                value={filters.radius}
                onChange={(v) => set("radius", v)}
              />
            </div>
          )}

          {/* Location notice */}
          {location.permissionDenied && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800">
              GPS access was denied. Using IP-based location instead. Enable
              location permission in your browser for more accurate results.
            </div>
          )}
          {!hasLocation && !location.loading && (
            <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-xs text-blue-800">
              Set your location above to find service providers nearest to you.
            </div>
          )}
        </div>
      )}

      {/* ── Active filters + result count ── */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ActiveFilters
          filters={filters}
          location={location}
          onRemove={removeFilter}
          onClearAll={clearAll}
        />
        <p className="text-xs text-muted-foreground ml-auto shrink-0">
          {loading ? (
            <span className="flex items-center gap-1">
              <IconLoader2 size={12} className="animate-spin" />
              Loading…
            </span>
          ) : (
            <>{resultCount} service{resultCount !== 1 ? "s" : ""} found</>
          )}
        </p>
      </div>
    </div>
  );
}
