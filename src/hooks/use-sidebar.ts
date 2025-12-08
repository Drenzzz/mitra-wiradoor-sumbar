import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarStore {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebar = create<SidebarStore>()(
  persist(
    (set) => ({
      isCollapsed: false,
      toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
