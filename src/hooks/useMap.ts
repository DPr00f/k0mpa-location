import { useEffect, useState } from "react";
import { useLeaflet } from "./useLeaflet";
import { useHashOptions } from "./useHashOptions";

export const useMap = ({
  mapReference,
  coordinates,
}: {
  mapReference: React.MutableRefObject<null>;
  coordinates?: { latitude: number; longitude: number; hidden?: boolean };
}) => {
  const { L } = useLeaflet();
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);

  const { options } = useHashOptions() as {
    options: { mode?: "dark"; zoom?: string };
  };

  // First setup of the map
  useEffect(() => {
    if (!L || map || !mapReference.current) return;

    const _map = L.map(mapReference.current, { zoomControl: false }).setView(
      [40.12069594820592, -8.61836346069649],
      options.zoom ? Number(options.zoom) : 7,
    );

    const isDarkMode = options.mode === "dark";

    L.tileLayer(`/tiles${isDarkMode ? "/dark" : ""}/{z}/{x}/{y}{r}.png`, {
      maxZoom: 20,
    }).addTo(_map);

    setMap(_map);
  }, [mapReference, map, L, options]);

  // Add marker
  useEffect(() => {
    if (!L || !map || !coordinates) return;

    const { latitude, longitude } = coordinates;

    if (!latitude || !longitude) return;

    const icon = L.divIcon({
      className: "k0mpa-face",
      html: "<div class='marker-pin'></div>",
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });

    const _marker = L.marker([latitude, longitude], { icon: icon });

    _marker.addTo(map);

    setMarker(_marker);
  }, [L, map, coordinates]);

  // Remove marker
  useEffect(() => {
    if (!marker || !coordinates?.hidden) return;

    marker.remove();

    setMarker(null);
  }, [marker, coordinates]);

  // On coordinates change
  useEffect(() => {
    if (!map || !coordinates || !marker) return;

    const { latitude, longitude } = coordinates;

    if (!latitude || !longitude) return;

    map.setView([latitude, longitude]);
    marker.setLatLng([latitude, longitude]);
  }, [map, coordinates, marker]);

  useEffect(() => {
    if (!L) return;

    if (options.zoom) {
      map?.setZoom(Number(options.zoom));
    }

    if (options.mode) {
      const isDarkMode = options.mode === "dark";
      map?.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          layer.setUrl(`/tiles${isDarkMode ? "/dark" : ""}/{z}/{x}/{y}{r}.png`);
        }
      });
    }
  }, [options, map, L]);
};
