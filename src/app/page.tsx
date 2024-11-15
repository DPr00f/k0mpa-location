import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Map from "~/components/Map";
import { getCoordinates } from "~/fetch/getCoordinates";

export default async function HomePage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["coordinates"],
    queryFn: getCoordinates,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="h-screen">
        <Map />
      </main>
    </HydrationBoundary>
  );
}
