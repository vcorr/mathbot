import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LevelStat {
  stars: number
  attempts: number
  bestCorrect: number
}

interface AppState {
  // Auth
  uid: string | null

  // Progression (mirrors Firestore progress doc)
  unlockedUpTo: number
  levelStats: Record<string, LevelStat>
  totalXp: number
  dailyXp: number
  dailyXpDate: string        // YYYY-MM-DD Helsinki
  streak: number
  lastPlayedDate: string     // YYYY-MM-DD Helsinki
  hearts: number             // 0–5
  heartsLastRegen: string    // ISO timestamp

  // Local settings (not synced to Firestore)
  muted: boolean
  dailyGoal: number          // XP target, default 30

  // Actions
  setUid: (uid: string | null) => void
  setUnlockedUpTo: (n: number) => void
  updateLevelStat: (levelId: string, stat: LevelStat) => void
  addXp: (amount: number, date: string) => void
  setStreak: (streak: number, date: string) => void
  deductHeart: () => void
  setHearts: (hearts: number, heartsLastRegen: string) => void
  setMuted: (muted: boolean) => void
  setDailyGoal: (goal: number) => void
  /** Bulk-load from Firestore after auth */
  hydrateFromFirestore: (data: {
    unlockedUpTo?: number
    totalXp?: number
    dailyXp?: number
    dailyXpDate?: string
    streak?: number
    lastPlayedDate?: string
    hearts?: number
    heartsLastRegen?: string
    levelStats?: Record<string, LevelStat>
  }) => void
}

const NOW_ISO = new Date().toISOString()

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      uid: null,
      unlockedUpTo: 0,
      levelStats: {},
      totalXp: 0,
      dailyXp: 0,
      dailyXpDate: '',
      streak: 0,
      lastPlayedDate: '',
      hearts: 5,
      heartsLastRegen: NOW_ISO,
      muted: false,
      dailyGoal: 30,

      setUid: (uid) => set({ uid }),

      setUnlockedUpTo: (unlockedUpTo) => set({ unlockedUpTo }),

      updateLevelStat: (levelId, stat) =>
        set((s) => ({ levelStats: { ...s.levelStats, [levelId]: stat } })),

      addXp: (amount, date) =>
        set((s) => ({
          totalXp: s.totalXp + amount,
          dailyXp: s.dailyXpDate === date ? s.dailyXp + amount : amount,
          dailyXpDate: date,
        })),

      setStreak: (streak, date) => set({ streak, lastPlayedDate: date }),

      deductHeart: () =>
        set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),

      setHearts: (hearts, heartsLastRegen) => set({ hearts, heartsLastRegen }),

      setMuted: (muted) => set({ muted }),

      setDailyGoal: (dailyGoal) => set({ dailyGoal }),

      hydrateFromFirestore: (data) =>
        set((s) => ({
          unlockedUpTo: data.unlockedUpTo ?? s.unlockedUpTo,
          totalXp: data.totalXp ?? s.totalXp,
          dailyXp: data.dailyXp ?? s.dailyXp,
          dailyXpDate: data.dailyXpDate ?? s.dailyXpDate,
          streak: data.streak ?? s.streak,
          lastPlayedDate: data.lastPlayedDate ?? s.lastPlayedDate,
          hearts: data.hearts ?? s.hearts,
          heartsLastRegen: data.heartsLastRegen ?? s.heartsLastRegen,
          levelStats: data.levelStats ?? s.levelStats,
        })),
    }),
    {
      name: 'mathbot:state:v1',
      partialize: (s) => ({
        unlockedUpTo: s.unlockedUpTo,
        levelStats: s.levelStats,
        totalXp: s.totalXp,
        dailyXp: s.dailyXp,
        dailyXpDate: s.dailyXpDate,
        streak: s.streak,
        lastPlayedDate: s.lastPlayedDate,
        hearts: s.hearts,
        heartsLastRegen: s.heartsLastRegen,
        muted: s.muted,
        dailyGoal: s.dailyGoal,
      }),
    },
  ),
)
