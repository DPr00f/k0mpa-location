import { useEffect, useState } from "react";

export const useLeaflet = () => {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    import("leaflet")
      .then((module) => module.default)
      .then((leaflet) => {
        setL(leaflet);
        setIsLoading(false);
      })
      .catch(console.error);
  });

  return {
    L,
    isLoading,
  };
};
