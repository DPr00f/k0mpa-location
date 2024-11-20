import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import addStadiaApiKey from "./server/middlewares/addStadiaApiKey";
import protectCoordinatesApi from "./server/middlewares/protectCoordinatesApi";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  addStadiaApiKey(request);
  protectCoordinatesApi(request);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}

export const config = {
  matcher: ["/tiles/:path*", "/api/:path*", "/vector/:path*"],
};
