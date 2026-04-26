import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../lib/store'
import { playCorrect } from '../lib/audio'
import { isFirebaseConfigured, isGoogleLinked, linkGoogleAccount } from '../lib/firebase'

const GOAL_OPTIONS = [10, 20, 30, 50, 100]

export default function SettingsScreen() {
  const navigate = useNavigate()
  const muted = useAppStore((s) => s.muted)
  const setMuted = useAppStore((s) => s.setMuted)
  const dailyGoal = useAppStore((s) => s.dailyGoal)
  const setDailyGoal = useAppStore((s) => s.setDailyGoal)
  const totalXp = useAppStore((s) => s.totalXp)
  const streak = useAppStore((s) => s.streak)

  const [googleLinked, setGoogleLinked] = useState(() => isGoogleLinked())
  const [linking, setLinking] = useState(false)
  const [linkError, setLinkError] = useState<string | null>(null)

  function toggleMute() {
    const next = !muted
    setMuted(next)
    if (!next) playCorrect(false)
  }

  async function handleLinkGoogle() {
    setLinking(true)
    setLinkError(null)
    const result = await linkGoogleAccount()
    setLinking(false)
    if (result.ok) {
      setGoogleLinked(true)
    } else {
      if (result.error !== 'auth/popup-closed-by-user' && result.error !== 'auth/cancelled-popup-request') {
        setLinkError('Yhdistäminen epäonnistui.')
      }
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="flex items-center gap-3 px-5 py-4 border-b border-line bg-surface">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full text-ink-soft text-lg font-black"
          onClick={() => navigate('/')}
          aria-label="Takaisin"
        >
          ←
        </button>
        <span className="text-lg font-black text-ink">Asetukset</span>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
        {/* Stats summary */}
        <div
          className="rounded-2xl p-4 flex gap-6 justify-center"
          style={{ background: 'var(--color-surface)', border: '2px solid var(--color-line)' }}
        >
          <div className="text-center">
            <div className="text-2xl font-black text-ink">{totalXp}</div>
            <div className="text-xs font-extrabold text-ink-soft uppercase tracking-wide">XP yhteensä</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-ink flex items-center gap-1">
              <span>🔥</span>{streak}
            </div>
            <div className="text-xs font-extrabold text-ink-soft uppercase tracking-wide">Putki</div>
          </div>
        </div>

        {/* Audio toggle */}
        <div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'var(--color-surface)', border: '2px solid var(--color-line)' }}
        >
          <div>
            <div className="font-extrabold text-ink">Äänet</div>
            <div className="text-sm text-ink-soft">Oikein/väärin -äänimerkit</div>
          </div>
          <button
            className="relative w-14 h-7 rounded-full transition-colors duration-200 flex-shrink-0"
            style={{ background: muted ? 'var(--color-line)' : 'var(--color-mint)' }}
            onClick={toggleMute}
            aria-label={muted ? 'Ota äänet käyttöön' : 'Mykistä'}
          >
            <span
              className="absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all duration-200"
              style={{ left: muted ? 2 : 30 }}
            />
          </button>
        </div>

        {/* Daily goal */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--color-surface)', border: '2px solid var(--color-line)' }}
        >
          <div className="font-extrabold text-ink mb-1">Päivän tavoite</div>
          <div className="text-sm text-ink-soft mb-4">Kuinka paljon XP:tä päivässä?</div>
          <div className="flex gap-2 flex-wrap">
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g}
                className="rounded-2xl px-4 py-2 text-sm font-extrabold border-2 transition-colors"
                style={
                  dailyGoal === g
                    ? {
                        borderColor: 'var(--color-gold)',
                        background: '#fff2c2',
                        color: 'var(--color-gold-d)',
                      }
                    : {
                        borderColor: 'var(--color-line)',
                        background: 'transparent',
                        color: 'var(--color-ink)',
                      }
                }
                onClick={() => setDailyGoal(g)}
              >
                {g} XP
              </button>
            ))}
          </div>
        </div>

        {/* Google account link */}
        {isFirebaseConfigured && (
          <div
            className="rounded-2xl p-4 flex items-center justify-between gap-4"
            style={{ background: 'var(--color-surface)', border: '2px solid var(--color-line)' }}
          >
            <div className="min-w-0">
              <div className="font-extrabold text-ink">Google-tili</div>
              <div className="text-sm text-ink-soft">
                {googleLinked
                  ? 'Edistymisesi on varmuuskopioitu.'
                  : 'Yhdistä, niin edistymisesi säilyy laitteen vaihtuessa.'}
              </div>
              {linkError && <div className="text-xs text-red-500 mt-1">{linkError}</div>}
            </div>
            {googleLinked ? (
              <span
                className="text-xs font-extrabold rounded-full px-3 py-1 flex-shrink-0"
                style={{ background: 'var(--color-mint-soft)', color: 'var(--color-mint-deep)' }}
              >
                ✓ Yhdistetty
              </span>
            ) : (
              <button
                className="rounded-2xl px-4 py-2 text-sm font-extrabold text-white flex-shrink-0"
                style={{ background: linking ? 'var(--color-line)' : 'var(--color-blue)' }}
                onClick={handleLinkGoogle}
                disabled={linking}
              >
                {linking ? '...' : 'Yhdistä'}
              </button>
            )}
          </div>
        )}

        {/* Version */}
        <div className="text-center text-xs text-ink-soft font-extrabold mt-auto pt-4">
          mathbot · kulmakerroin v0.1
        </div>
      </div>
    </div>
  )
}
