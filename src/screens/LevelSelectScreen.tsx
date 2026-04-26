import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../lib/store'
import { course } from '../courses/kulmakerroin'

const OFFSETS = [0, 24, 48, 24, 0]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 mt-1">
      {[1, 2, 3].map((n) => (
        <span key={n} style={{ color: n <= count ? 'var(--color-gold)' : 'var(--color-line)', fontSize: 14 }}>
          ★
        </span>
      ))}
    </div>
  )
}

function Hearts({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            fontSize: 16,
            opacity: n <= count ? 1 : 0.25,
            filter: n <= count ? 'none' : 'grayscale(1)',
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  )
}

export default function LevelSelectScreen() {
  const navigate = useNavigate()
  const unlockedUpTo = useAppStore((s) => s.unlockedUpTo)
  const levelStats = useAppStore((s) => s.levelStats)
  const totalXp = useAppStore((s) => s.totalXp)
  const dailyXp = useAppStore((s) => s.dailyXp)
  const dailyGoal = useAppStore((s) => s.dailyGoal)
  const streak = useAppStore((s) => s.streak)
  const hearts = useAppStore((s) => s.hearts)

  const levels = course.levels
  const dailyProgress = Math.min(1, dailyXp / dailyGoal)

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-line bg-surface">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-tight text-ink">mathbot</span>
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <span style={{ fontSize: 16 }}>🔥</span>
              <span className="text-sm font-extrabold text-ink">{streak}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Hearts count={hearts} />
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full text-ink-soft"
            style={{ fontSize: 18 }}
            onClick={() => navigate('/settings')}
            aria-label="Asetukset"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* XP total */}
        <div className="text-xs font-extrabold text-ink-soft text-right mb-4">
          {totalXp} XP yhteensä
        </div>

        {/* Daily goal card */}
        <div
          className="rounded-2xl border-2 p-4 mb-6"
          style={{ borderColor: dailyProgress >= 1 ? 'var(--color-mint)' : 'var(--color-gold)' }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-extrabold text-ink">
              {dailyProgress >= 1 ? '✅ Päivän tavoite saavutettu!' : 'Päivän tavoite'}
            </span>
            <span className="text-xs font-extrabold text-ink-soft">
              {dailyXp} / {dailyGoal} XP
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--color-line)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${dailyProgress * 100}%`,
                background: dailyProgress >= 1 ? 'var(--color-mint)' : 'var(--color-gold)',
              }}
            />
          </div>
        </div>

        {/* Section heading */}
        <h1 className="text-base font-extrabold tracking-widest uppercase text-ink-soft mb-5">
          Valitse harjoitus
        </h1>

        {/* Winding path */}
        <div className="flex flex-col gap-0">
          {levels.map((level, i) => {
            const isLocked = i > unlockedUpTo
            const isCompleted = i < unlockedUpTo
            const stat = levelStats[level.id]

            return (
              <div key={level.id}>
                {i > 0 && (
                  <div
                    style={{ marginLeft: Math.min(OFFSETS[i], OFFSETS[i - 1]) + 27 }}
                    className="w-0.5 h-6 bg-line"
                  />
                )}
                <div style={{ marginLeft: OFFSETS[i] }}>
                  <button
                    className="flex items-center gap-4 w-full text-left"
                    disabled={isLocked}
                    onClick={() => navigate('/practice', { state: { levelIndex: i, isPractice: isCompleted } })}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                      style={
                        isLocked
                          ? { background: 'var(--color-line)', boxShadow: '0 4px 0 #c9c0ae' }
                          : { background: level.tint, boxShadow: `0 4px 0 ${level.shadow}` }
                      }
                    >
                      {isLocked ? (
                        <span className="text-2xl" style={{ color: 'var(--color-ink-soft)' }}>🔒</span>
                      ) : (
                        <span>{level.icon}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className="font-extrabold text-base leading-tight"
                        style={{ color: isLocked ? 'var(--color-ink-soft)' : 'var(--color-ink)' }}
                      >
                        {level.title}
                      </div>
                      <div className="text-sm text-ink-soft leading-tight mt-0.5">{level.subtitle}</div>
                      {isCompleted && <StarRow count={stat?.stars ?? 0} />}
                    </div>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
