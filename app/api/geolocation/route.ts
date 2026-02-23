// app/api/geolocation/route.ts
// Server-side IP geolocation — the browser never directly calls ip-api.com,
// so we get the user's real server-visible IP from request headers.
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // never cache this route at the edge

interface IpApiResponse {
  status: "success" | "fail";
  message?: string;
  city?: string;
  regionName?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
}

export async function GET(request: NextRequest) {
  // Resolve the client IP. In production (Vercel / Nginx / Cloudflare) the
  // real IP is forwarded via one of these headers.
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  let clientIp =
    forwardedFor?.split(",")[0]?.trim() ?? realIp ?? null;

  // In local development the IP is loopback — pass an empty string so
  // ip-api.com resolves the server's own public IP instead.
  if (
    !clientIp ||
    clientIp === "::1" ||
    clientIp === "127.0.0.1" ||
    clientIp.startsWith("192.168.") ||
    clientIp.startsWith("10.")
  ) {
    clientIp = "";
  }

  try {
    // ip-api.com is free (no key needed) and returns city/region/lat/lon.
    // The free tier only supports HTTP (not HTTPS), which is fine here
    // because this call is made server-to-server, not from the browser.
    const apiUrl = `http://ip-api.com/json/${clientIp}?fields=status,message,city,regionName,country,countryCode,lat,lon,timezone`;

    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
      // Do not cache across requests; each user has a different IP
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "IP geolocation service unavailable" },
        { status: 502 }
      );
    }

    const data: IpApiResponse = await response.json();

    if (data.status === "fail") {
      return NextResponse.json(
        { error: data.message ?? "Location could not be determined" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      city: data.city ?? null,
      state: data.regionName ?? null,
      country: data.country ?? null,
      countryCode: data.countryCode ?? null,
      lat: data.lat ?? null,
      lng: data.lon ?? null,
      timezone: data.timezone ?? null,
      method: "ip" as const,
    });
  } catch (err) {
    console.error("[geolocation] IP lookup failed:", err);
    return NextResponse.json(
      { error: "Failed to detect location" },
      { status: 500 }
    );
  }
}
