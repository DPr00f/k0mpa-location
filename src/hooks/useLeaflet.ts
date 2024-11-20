import { useEffect, useState } from "react";

export const useLeaflet = () => {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [maplibregl, setMaplibregl] = useState<
    typeof import("maplibre-gl") | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("maplibre-gl")
      .then((module) => module.default)
      .then((maplibregl) => {
        setMaplibregl(maplibregl);
        if (typeof window !== "undefined") window.maplibregl = maplibregl;
        return import("leaflet");
      })
      .then((module) => module.default)
      .then((leaflet) => {
        setL(leaflet);
        if (typeof window !== "undefined") window.L = leaflet;
        return import("@maplibre/maplibre-gl-leaflet");
      })
      .then(() => {
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  return {
    L,
    maplibregl,
    isLoading,
  };
};
