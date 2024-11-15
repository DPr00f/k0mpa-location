import { type NextRequest } from "next/server";
import { env } from "~/env";

export default function addStadiaApiKey(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  if (request.url.includes("/tiles/")) {
    requestHeaders.set("Authorization", `Stadia-Auth ${env.STADIA_API_KEY}`);
  }
}
