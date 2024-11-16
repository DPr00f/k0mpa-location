import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Theme = {
  theme: string;
  toggle: () => void;
  setDark: (bool: boolean) => void;
};

const useTheme = create<Theme>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
      setDark: (bool: boolean) => set({ theme: bool ? "dark" : "light" }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useTheme;
