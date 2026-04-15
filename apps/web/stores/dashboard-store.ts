"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type DashboardStore = {
  activeTeamName: string | null;
  setActiveTeamName: (teamName: string) => void;
};

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      activeTeamName: null,
      setActiveTeamName: (teamName) => set({ activeTeamName: teamName }),
    }),
    {
      name: "web-dashboard-store",
      partialize: (state) => ({ activeTeamName: state.activeTeamName }),
    }
  )
);
