import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import LevelSelectScreen from './screens/LevelSelectScreen'
import PracticeScreen from './screens/PracticeScreen'
import CompleteScreen from './screens/CompleteScreen'
import { useAppStore } from './lib/store'
import {
  ensureAnonymousSignIn,
  ensureProfileDoc,
  isFirebaseConfigured,
  watchAuth,
} from './lib/firebase'

export default function App() {
  const setUid = useAppStore((s) => s.setUid)

  useEffect(() => {
    if (!isFirebaseConfigured) {
      console.warn(
        '[mathbot] Firebase not configured — running in scaffold-only mode. ' +
          'Create .env.local from .env.local.example.',
      )
      return
    }

    const unsubscribe = watchAuth((user) => {
      setUid(user?.uid ?? null)
    })

    ensureAnonymousSignIn()
      .then((user) => {
        if (user) return ensureProfileDoc(user.uid)
      })
      .catch((err) => console.error('[mathbot] auth/profile init failed', err))

    return unsubscribe
  }, [setUid])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LevelSelectScreen />} />
        <Route path="/practice" element={<PracticeScreen />} />
        <Route path="/complete" element={<CompleteScreen />} />
      </Routes>
    </HashRouter>
  )
}
