import { Link } from 'react-router-dom'
import { useAppStore } from '../lib/store'
import { isFirebaseConfigured } from '../lib/firebase'

export default function LevelSelectScreen() {
  const uid = useAppStore((s) => s.uid)
  const unlockedUpTo = useAppStore((s) => s.unlockedUpTo)

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="text-xs tracking-[0.18em] text-ink-soft uppercase">
        mathbot · M0 scaffold
      </div>
      <h1 className="text-3xl text-ink">Level select (placeholder)</h1>
      <div className="rounded-[var(--radius-card)] border border-line bg-surface px-5 py-4 text-sm font-semibold">
        <div>
          Firebase configured:{' '}
          <span className={isFirebaseConfigured ? 'text-mint-deep' : 'text-coral-d'}>
            {isFirebaseConfigured ? 'yes' : 'no — add .env.local'}
          </span>
        </div>
        <div>
          UID:{' '}
          <span className="font-mono text-ink-soft">
            {uid ?? '—'}
          </span>
        </div>
        <div>
          unlockedUpTo:{' '}
          <span className="font-mono text-ink-soft">{unlockedUpTo}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <Link
          to="/practice"
          className="rounded-full bg-mint px-5 py-3 text-surface shadow-[0_4px_0_var(--color-mint-d)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-mint-d)]"
        >
          → Practice
        </Link>
        <Link
          to="/complete"
          className="rounded-full bg-gold px-5 py-3 text-ink shadow-[0_4px_0_var(--color-gold-d)] active:translate-y-[2px] active:shadow-[0_2px_0_var(--color-gold-d)]"
        >
          → Complete
        </Link>
      </div>
    </div>
  )
}
