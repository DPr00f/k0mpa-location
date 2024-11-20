import { useEffect, useState } from "react";
import { useLeaflet } from "./useLeaflet";
import { useHashOptions } from "./useHashOptions";
import useTheme from "~/stores/useTheme";

export const useMap = ({
  mapReference,
  coordinates,
}: {
  mapReference: React.MutableRefObject<null>;
  coordinates?: { latitude: number; longitude: number; hidden?: boolean };
}) => {
  const { L, isLoading } = useLeaflet();
  const [map, setMap] = useState<L.Map | null>(null);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const { theme, setDark } = useTheme();

  const { options } = useHashOptions() as {
    options: { mode?: "dark"; zoom?: string };
  };

  // First setup of the map
  useEffect(() => {
    if (!L || isLoading || map || !mapReference.current) return;

    const _map = L.map(mapReference.current, { zoomControl: false }).setView(
      [40.12069594820592, -8.61836346069649],
      options.zoom ? Number(options.zoom) : 7,
    );

    const isDarkMode = options.mode === "dark";

    L.maplibreGL({
      style: `/vector/alidade_smooth${isDarkMode ? "_dark" : ""}.json`,
    }).addTo(_map);

    setMap(_map);
  }, [mapReference, map, L, options, isLoading]);

  // Add marker
  useEffect(() => {
    if (!L || !map || !coordinates || marker) return;

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
  }, [L, map, coordinates, marker]);

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
      setDark(options.mode === "dark");
    }
  }, [options, map, L, setDark]);

  useEffect(() => {
    if (!L) return;

    const isDarkMode = theme === "dark";
    map?.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        layer.setUrl(`/tiles${isDarkMode ? "/dark" : ""}/{z}/{x}/{y}{r}.png`);
      }
      if (layer instanceof L.MaplibreGL) {
        layer
          .getMaplibreMap()
          .setStyle(`/vector/alidade_smooth${isDarkMode ? "_dark" : ""}.json`);
      }
    });
  }, [theme, map, L]);
};
