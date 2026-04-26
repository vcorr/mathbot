import { Link } from 'react-router-dom'

export default function CompleteScreen() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl text-ink">Complete (placeholder)</h1>
      <Link to="/" className="text-mint-deep underline">
        ← Back to level select
      </Link>
    </div>
  )
}
