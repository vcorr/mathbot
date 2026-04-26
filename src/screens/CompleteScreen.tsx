import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../lib/store'

interface CompleteState {
  levelIndex: number
  levelId: string
  wrongCount: number
  totalQuestions: number
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className="text-4xl"
          style={{
            color: n <= count ? 'var(--color-gold)' : 'var(--color-line)',
            filter: n <= count ? 'drop-shadow(0 2px 0 var(--color-gold-d))' : 'none',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <div
      className="flex-1 rounded-2xl p-4 text-center"
      style={{ background: 'var(--color-surface)', border: '2px solid var(--color-line)' }}
    >
      <div className="text-2xl font-black" style={{ color: accent }}>
        {value}
      </div>
      <div className="text-xs font-extrabold text-ink-soft mt-1 uppercase tracking-wide">{label}</div>
    </div>
  )
}

export default function CompleteScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as CompleteState | null

  const updateLevelStat = useAppStore((s) => s.updateLevelStat)
  const setUnlockedUpTo = useAppStore((s) => s.setUnlockedUpTo)
  const addXp = useAppStore((s) => s.addXp)
  const unlockedUpTo = useAppStore((s) => s.unlockedUpTo)
  const levelStats = useAppStore((s) => s.levelStats)

  const appliedRef = useRef(false)

  useEffect(() => {
    if (!state) {
      navigate('/', { replace: true })
      return
    }
    if (appliedRef.current) return
    appliedRef.current = true

    const { levelIndex, levelId, wrongCount, totalQuestions } = state
    const correctCount = totalQuestions - wrongCount
    const stars = wrongCount === 0 ? 3 : wrongCount === 1 ? 2 : 1
    const xpEarned = correctCount * 10

    const existing = levelStats[levelId]
    updateLevelStat(levelId, {
      stars: Math.max(stars, existing?.stars ?? 0),
      attempts: (existing?.attempts ?? 0) + 1,
      bestCorrect: Math.max(correctCount, existing?.bestCorrect ?? 0),
    })

    if (levelIndex + 1 > unlockedUpTo) {
      setUnlockedUpTo(levelIndex + 1)
    }

    addXp(xpEarned)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) return null

  const { wrongCount, totalQuestions } = state
  const correctCount = totalQuestions - wrongCount
  const accuracy = Math.round((correctCount / totalQuestions) * 100)
  const xpEarned = correctCount * 10
  const stars = wrongCount === 0 ? 3 : wrongCount === 1 ? 2 : 1

  return (
    <div className="flex flex-col min-h-full items-center justify-center px-6 py-10 gap-8">
      {/* Crown + heading */}
      <div className="text-center">
        <div className="text-6xl mb-3">👑</div>
        <h1 className="text-2xl font-black text-ink">Hienoa! Taso suoritettu!</h1>
        <p className="text-sm text-ink-soft font-extrabold mt-2">
          Olet nyt lähempänä koordinaattigeometrian hallintaa.
        </p>
      </div>

      {/* Stars */}
      <Stars count={stars} />

      {/* Stat tiles */}
      <div className="flex gap-3 w-full">
        <StatTile label="XP" value={`+${xpEarned}`} accent="var(--color-gold)" />
        <StatTile label="Tarkkuus" value={`${accuracy}%`} accent="var(--color-mint-deep)" />
      </div>

      {/* Jatka button */}
      <button
        className="w-full rounded-2xl py-4 text-base font-black text-white"
        style={{
          background: 'var(--color-mint)',
          boxShadow: '0 4px 0 var(--color-mint-d)',
        }}
        onClick={() => navigate('/')}
      >
        Jatka
      </button>
    </div>
  )
}
