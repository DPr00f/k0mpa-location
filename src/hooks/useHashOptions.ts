"use client";
import { useCallback, useEffect, useState } from "react";

export const useHashOptions = () => {
  const [hash, setHash] = useState(() => window.location.hash);
  const [options, setOptions] = useState<Record<string, string>>({});

  const hashChangeHandler = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", hashChangeHandler);
    return () => {
      window.removeEventListener("hashchange", hashChangeHandler);
    };
  }, [hashChangeHandler]);

  useEffect(() => {
    const hashOptions = hash
      .slice(1)
      .split("&")
      .reduce((acc, hashOption) => {
        const [key, value] = hashOption.split("=");

        if (!key || !value) return acc;

        return {
          ...acc,
          [key]: value,
        };
      }, {});
    setOptions(hashOptions);
    window.location.hash = "";
  }, [hash]);

  return {
    hash,
    options,
  };
};
