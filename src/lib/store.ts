import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LevelStat {
  stars: number;
  attempts: number;
  bestCorrect: number;
}

interface AppState {
  uid: string | null
  unlockedUpTo: number
  levelStats: Record<string, LevelStat>
  totalXp: number
  setUid: (uid: string | null) => void
  setUnlockedUpTo: (n: number) => void
  updateLevelStat: (levelId: string, stat: LevelStat) => void
  addXp: (amount: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      uid: null,
      unlockedUpTo: 0,
      levelStats: {},
      totalXp: 0,
      setUid: (uid) => set({ uid }),
      setUnlockedUpTo: (unlockedUpTo) => set({ unlockedUpTo }),
      updateLevelStat: (levelId, stat) =>
        set((state) => ({
          levelStats: { ...state.levelStats, [levelId]: stat },
        })),
      addXp: (amount) => set((state) => ({ totalXp: state.totalXp + amount })),
    }),
    {
      name: 'mathbot:state:v1',
      partialize: (state) => ({
        unlockedUpTo: state.unlockedUpTo,
        levelStats: state.levelStats,
        totalXp: state.totalXp,
      }),
    },
  ),
)
