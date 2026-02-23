// hooks/useUserLocation.ts
// Detects user location with three fallbacks:
//   1. Browser GPS (most accurate, requires permission)
//   2. IP geolocation via /api/geolocation (no permission needed)
//   3. Stored user profile city/state (from auth store)
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/store/useAuth";

export type LocationMethod = "gps" | "ip" | "profile" | "manual" | null;

export type LocationData = {
  city: string | null;
  state: string | null;
  country: string | null;
  lat: number | null;
  lng: number | null;
  method: LocationMethod;
  loading: boolean;
  error: string | null;
  permissionDenied: boolean;
};

const INITIAL_STATE: LocationData = {
  city: null,
  state: null,
  country: null,
  lat: null,
  lng: null,
  method: null,
  loading: true,
  error: null,
  permissionDenied: false,
};

// ─── Nominatim reverse-geocode (free, no key) ──────────────────────────────
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string | null; state: string | null; country: string | null }> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Nuvylux/1.0" },
    });
    if (!res.ok) return { city: null, state: null, country: null };
    const data = await res.json();
    const addr = data.address ?? {};
    return {
      city:
        addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? null,
      state: addr.state ?? addr.region ?? null,
      country: addr.country ?? null,
    };
  } catch {
    return { city: null, state: null, country: null };
  }
}

// ─── GPS wrapper ────────────────────────────────────────────────────────────
function getBrowserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation API not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
      maximumAge: 10 * 60 * 1000, // accept cached position up to 10 min old
      enableHighAccuracy: false,
    });
  });
}

// ────────────────────────────────────────────────────────────────────────────

export function useUserLocation() {
  const { user } = useAuth();
  const [location, setLocation] = useState<LocationData>(INITIAL_STATE);
  const hasDetected = useRef(false);

  const detectLocation = useCallback(async () => {
    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    // ── 1. Browser GPS ─────────────────────────────────────────────────────
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      try {
        const pos = await getBrowserPosition();
        const { latitude: lat, longitude: lng } = pos.coords;
        const geo = await reverseGeocode(lat, lng);
        setLocation({
          ...geo,
          lat,
          lng,
          method: "gps",
          loading: false,
          error: null,
          permissionDenied: false,
        });
        return;
      } catch (gpsErr: any) {
        const denied =
          gpsErr?.code === 1; // PERMISSION_DENIED
        if (denied) {
          // Fall through to IP, but remember so we can show a hint
          setLocation((prev) => ({ ...prev, permissionDenied: true }));
        }
        // Any other error (timeout, unavailable) → fall through
      }
    }

    // ── 2. IP-based geolocation ────────────────────────────────────────────
    try {
      const res = await fetch("/api/geolocation", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (!data.error) {
          setLocation((prev) => ({
            ...prev,
            city: data.city ?? null,
            state: data.state ?? null,
            country: data.country ?? null,
            lat: data.lat ?? null,
            lng: data.lng ?? null,
            method: "ip",
            loading: false,
            error: null,
          }));
          return;
        }
      }
    } catch {
      // IP lookup failed → fall through
    }

    // ── 3. Stored user profile ─────────────────────────────────────────────
    if (user?.city || user?.state) {
      setLocation((prev) => ({
        ...prev,
        city: user.city ?? null,
        state: user.state ?? null,
        country: user.country ?? null,
        lat: null,
        lng: null,
        method: "profile",
        loading: false,
        error: null,
      }));
      return;
    }

    // ── All methods exhausted ──────────────────────────────────────────────
    setLocation((prev) => ({
      ...prev,
      loading: false,
      error: "Could not determine your location.",
    }));
  }, [user]);

  // Auto-detect once on mount
  useEffect(() => {
    if (!hasDetected.current) {
      hasDetected.current = true;
      detectLocation();
    }
  }, [detectLocation]);

  /** Let the user manually override the detected city/state */
  const setManualLocation = useCallback(
    (city: string, state: string, country: string) => {
      setLocation({
        city,
        state,
        country,
        lat: null,
        lng: null,
        method: "manual",
        loading: false,
        error: null,
        permissionDenied: false,
      });
    },
    []
  );

  /** Re-run detection (e.g. user clicks "Refresh location") */
  const refreshLocation = useCallback(() => {
    detectLocation();
  }, [detectLocation]);

  return { location, refreshLocation, setManualLocation };
}
