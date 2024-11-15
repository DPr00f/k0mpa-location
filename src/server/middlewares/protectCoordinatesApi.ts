import { type NextRequest } from "next/server";
import { env } from "~/env";

export default function protectCoordinatesApi(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  if (request.url.includes("/api/coordinates") && request.method !== "GET") {
    const apiPassword = requestHeaders.get("x-api-password");

    if (apiPassword !== env.API_PASSWORD) {
      return new Response("Unauthorized", { status: 401 });
    }
  }
}
