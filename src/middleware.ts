import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { env } from "./env";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Authorization", `Stadia-Auth ${env.STADIA_API_KEY}`);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: "/tiles/:path*",
};
