"use client";
import { useCallback, useEffect, useState } from "react";

export const useHashOptions = () => {
  const [hash, setHash] = useState(() =>
    typeof window === "undefined"
      ? ""
      : !window.location.hash || window.location.hash === "#"
        ? window.location.search.replace("?", "")
        : window.location.hash.replace("#", ""),
  );
  const [options, setOptions] = useState<Record<string, string | boolean>>({});

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash.replace("#", ""));
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, [hashChangeHandler]);

  useEffect(() => {
    const hashOptions = hash.split("&").reduce((acc, hashOption) => {
      const [key, _value] = hashOption.split("=");
      let value: string | boolean | undefined = _value;

      if (!key) return acc;

      if (!value) {
        value = true;
      }

      return {
        ...acc,
        [key]: value,
      };
    }, {});
    setOptions(hashOptions);
  }, [hash]);

  return {
    hash,
    options,
  };
};
