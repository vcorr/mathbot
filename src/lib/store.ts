import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  uid: string | null
  unlockedUpTo: number
  setUid: (uid: string | null) => void
  setUnlockedUpTo: (n: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      uid: null,
      unlockedUpTo: 0,
      setUid: (uid) => set({ uid }),
      setUnlockedUpTo: (unlockedUpTo) => set({ unlockedUpTo }),
    }),
    {
      name: 'mathbot:state:v1',
      partialize: (state) => ({ unlockedUpTo: state.unlockedUpTo }),
    },
  ),
)
