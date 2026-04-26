import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../lib/store'
import { course } from '../courses/kulmakerroin'

// Winding-path horizontal offsets per spec: [0, 24, 48, 24, 0]
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

export default function LevelSelectScreen() {
  const navigate = useNavigate()
  const unlockedUpTo = useAppStore((s) => s.unlockedUpTo)
  const levelStats = useAppStore((s) => s.levelStats)
  const totalXp = useAppStore((s) => s.totalXp)

  const levels = course.levels

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-line bg-surface">
        <span className="text-xl font-black tracking-tight text-ink">mathbot</span>
        <span className="text-sm font-extrabold text-ink-soft">{totalXp} XP</span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <h1 className="text-base font-extrabold tracking-widest uppercase text-ink-soft mb-6">
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
                {/* Connector line above (except first) */}
                {i > 0 && (
                  <div
                    style={{ marginLeft: Math.min(OFFSETS[i], OFFSETS[i - 1]) + 27 }}
                    className="w-0.5 h-6 bg-line"
                  />
                )}

                {/* Node row */}
                <div style={{ marginLeft: OFFSETS[i] }}>
                  <button
                    className="flex items-center gap-4 w-full text-left"
                    disabled={isLocked}
                    onClick={() => navigate('/practice', { state: { levelIndex: i } })}
                  >
                    {/* Icon circle */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white flex-shrink-0 relative"
                      style={
                        isLocked
                          ? {
                              background: 'var(--color-line)',
                              boxShadow: '0 4px 0 #c9c0ae',
                            }
                          : {
                              background: level.tint,
                              boxShadow: `0 4px 0 ${level.shadow}`,
                            }
                      }
                    >
                      {isLocked ? (
                        <span className="text-2xl" style={{ color: 'var(--color-ink-soft)' }}>🔒</span>
                      ) : (
                        <span>{level.icon}</span>
                      )}
                    </div>

                    {/* Label */}
                    <div className="min-w-0">
                      <div
                        className="font-extrabold text-base leading-tight"
                        style={{ color: isLocked ? 'var(--color-ink-soft)' : 'var(--color-ink)' }}
                      >
                        {level.title}
                      </div>
                      <div className="text-sm text-ink-soft leading-tight mt-0.5">
                        {level.subtitle}
                      </div>
                      {isCompleted && stat && <StarRow count={stat.stars} />}
                      {isCompleted && !stat && <StarRow count={0} />}
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
