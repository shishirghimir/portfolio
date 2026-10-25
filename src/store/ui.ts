import { create } from "zustand";

/** Site-wide UI state: the command palette, the terminal and the mobile menu. */
type UI = {
  palette: boolean;
  terminal: boolean;
  menu: boolean;
  openPalette: () => void;
  openTerminal: () => void;
  toggleMenu: (v?: boolean) => void;
  closeAll: () => void;
};

export const useUI = create<UI>((set) => ({
  palette: false,
  terminal: false,
  menu: false,
  openPalette: () => set({ palette: true, terminal: false, menu: false }),
  openTerminal: () => set({ terminal: true, palette: false, menu: false }),
  toggleMenu: (v) => set((s) => ({ menu: v ?? !s.menu })),
  closeAll: () => set({ palette: false, terminal: false, menu: false }),
}));
