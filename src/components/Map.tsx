"use client";

import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getCoordinates } from "~/fetch/getCoordinates";
import { useMap } from "~/hooks/useMap";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import useTheme from "~/stores/useTheme";
import { useHashOptions } from "~/hooks/useHashOptions";

export default function Map() {
  const { theme, setDark } = useTheme();
  const { data: coordinates } = useQuery({
    queryKey: ["coordinates"],
    queryFn: getCoordinates,
    refetchInterval: 10000,
  });
  const mapRef = useRef(null);
  useMap({ mapReference: mapRef, coordinates });
  const { options } = useHashOptions() as { options: { hide?: boolean } };

  const toggleDarkMode = (checked: boolean) => {
    setDark(checked);
  };

  return (
    <>
      <div ref={mapRef} className="h-full"></div>
      {!options?.hide ? (
        <div className="absolute right-10 top-10 z-[5000]">
          <DarkModeSwitch
            style={{ marginBottom: "2rem" }}
            checked={theme === "dark"}
            onChange={toggleDarkMode}
            size={30}
          />
        </div>
      ) : null}
    </>
  );
}
