"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getCoordinates } from "~/fetch/getCoordinates";
import { useMap } from "~/hooks/useMap";

export default function Map() {
  const { data: coordinates } = useQuery({
    queryKey: ["coordinates"],
    queryFn: getCoordinates,
    refetchInterval: 10000,
  });
  const mapRef = useRef(null);
  useMap({ mapReference: mapRef, coordinates });

  return <div ref={mapRef} className="h-full"></div>;
}
