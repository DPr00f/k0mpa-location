"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getCoordinates } from "~/fetch/getCoordinates";

export default function Map() {
  const mapRef = useRef(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const {
    data: coordinates,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["coordinates"],
    queryFn: getCoordinates,
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (map || !mapRef.current || isLoading || error || !coordinates) return;

    const { latitude, longitude } = coordinates;
    import("leaflet")
      .then((module) => module.default)
      .then((L) => {
        if (map || !mapRef.current || isLoading || error || !coordinates)
          return;

        const _map = L.map(mapRef.current).setView([latitude, longitude], 7);

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(_map);

        const _marker = L.marker([latitude, longitude]);

        _marker.addTo(_map);

        setMap(_map);
        setMarker(_marker);
      })
      .catch(console.error);
  }, [mapRef, isLoading, error, coordinates, map]);

  useEffect(() => {
    if (!map || !coordinates || !marker) return;

    const { latitude, longitude } = coordinates;

    map.setView([latitude, longitude]);
    marker.setLatLng([latitude, longitude]);
  }, [map, coordinates, marker]);

  return <div ref={mapRef} className="h-full"></div>;
}
