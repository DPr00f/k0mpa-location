export const getCoordinates = async () => {
  const isServer = typeof window === "undefined";
  const res = await fetch(
    (isServer ? "http://127.0.0.1:3000" : "") + "/api/coordinates",
    {
      headers: {
        "Cache-Control": "no-cache",
      },
    },
  );

  return (await res.json()) as { latitude: number; longitude: number };
};
