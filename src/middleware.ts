import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  if (request.url.includes("/tiles/")) {
    requestHeaders.set("Authorization", `Stadia-Auth ${env.STADIA_API_KEY}`);
  }

  if (request.url.includes("/api/coordinates") && request.method !== "GET") {
    const apiPassword = requestHeaders.get("x-api-password");

    if (apiPassword !== env.API_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/tiles/:path*", "/api/:path*"],
};
