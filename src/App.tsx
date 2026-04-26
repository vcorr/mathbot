import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import LevelSelectScreen from './screens/LevelSelectScreen'
import PracticeScreen from './screens/PracticeScreen'
import CompleteScreen from './screens/CompleteScreen'
import SettingsScreen from './screens/SettingsScreen'
import { useAppStore } from './lib/store'
import {
  ensureAnonymousSignIn,
  ensureProfileDoc,
  isFirebaseConfigured,
  watchAuth,
  loadUserDoc,
  applyHeartsRegen,
} from './lib/firebase'

export default function App() {
  const setUid = useAppStore((s) => s.setUid)
  const hydrateFromFirestore = useAppStore((s) => s.hydrateFromFirestore)
  const setHearts = useAppStore((s) => s.setHearts)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn(
        '[mathbot] Firebase not configured — running offline. Create .env.local from .env.local.example.',
      )
      return
    }

    const unsubscribe = watchAuth((user) => {
      setUid(user?.uid ?? null)
    })

    ensureAnonymousSignIn()
      .then(async (user) => {
        if (!user) return
        await ensureProfileDoc(user.uid)

        // Load progress from Firestore and hydrate local store
        const userDoc = await loadUserDoc(user.uid)
        if (userDoc) {
          const p = userDoc.progress ?? {}
          hydrateFromFirestore({
            unlockedUpTo: p.unlockedUpTo,
            totalXp: p.totalXp,
            dailyXp: p.dailyXp,
            dailyXpDate: p.dailyXpDate,
            streak: p.streak,
            lastPlayedDate: p.lastPlayedDate,
            hearts: p.hearts,
            heartsLastRegen: p.heartsLastRegen,
            levelStats: userDoc.levelStats,
          })

          // Apply hearts regen since last session
          if (p.hearts !== undefined && p.heartsLastRegen) {
            const { hearts, heartsLastRegen } = applyHeartsRegen(p.hearts, p.heartsLastRegen)
            if (hearts !== p.hearts) setHearts(hearts, heartsLastRegen)
          }
        }
      })
      .catch((err) => console.error('[mathbot] auth/profile init failed', err))

    return unsubscribe
  }, [setUid, hydrateFromFirestore, setHearts])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LevelSelectScreen />} />
        <Route path="/practice" element={<PracticeScreen />} />
        <Route path="/complete" element={<CompleteScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
      </Routes>
    </HashRouter>
  )
}
