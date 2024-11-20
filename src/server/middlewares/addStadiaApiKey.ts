import { type NextRequest } from "next/server";
import { env } from "~/env";

export default function addStadiaApiKey(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  if (request.url.includes("/tiles/") || request.url.includes("/vector/")) {
    requestHeaders.set("Authorization", `Stadia-Auth ${env.STADIA_API_KEY}`);
  }
}
