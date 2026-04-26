import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithCredential,
  type AuthError,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Firestore,
  type Timestamp,
} from 'firebase/firestore'
import type { LevelStat } from './store'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId)

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined

if (isFirebaseConfigured) {
  app = initializeApp(config)
  auth = getAuth(app)
  db = getFirestore(app)
}

export { app, auth, db }

export function watchAuth(callback: (user: User | null) => void): () => void {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export async function ensureAnonymousSignIn(): Promise<User | null> {
  if (!auth) return null
  if (auth.currentUser) return auth.currentUser
  const credential = await signInAnonymously(auth)
  return credential.user
}

export function isGoogleLinked(): boolean {
  return auth?.currentUser?.providerData.some((p) => p.providerId === 'google.com') ?? false
}

export async function linkGoogleAccount(): Promise<{ ok: boolean; recovered?: boolean; error?: string }> {
  if (!auth?.currentUser) return { ok: false, error: 'not-signed-in' }
  if (isGoogleLinked()) return { ok: true }
  try {
    await linkWithPopup(auth.currentUser, new GoogleAuthProvider())
    return { ok: true }
  } catch (e: unknown) {
    const err = e as AuthError
    // Google account already linked to a previous UID (e.g. after reinstall).
    // Sign in with that credential so the user recovers their old progress.
    if (err.code === 'auth/credential-already-in-use') {
      const credential = GoogleAuthProvider.credentialFromError(err)
      if (credential) {
        try {
          await signInWithCredential(auth, credential)
          return { ok: true, recovered: true }
        } catch {
          // fall through to generic error
        }
      }
    }
    if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
      return { ok: false, error: err.code }
    }
    return { ok: false, error: err.code ?? 'unknown' }
  }
}

// ─── Progress types ────────────────────────────────────────────────────────

export interface FirestoreProgress {
  unlockedUpTo: number
  totalXp: number
  dailyXp: number
  dailyXpDate: string       // YYYY-MM-DD Helsinki time
  streak: number
  lastPlayedDate: string    // YYYY-MM-DD Helsinki time
  hearts: number
  heartsLastRegen: string   // ISO timestamp
}

export interface FirestoreUserDoc {
  progress?: Partial<FirestoreProgress>
  levelStats?: Record<string, LevelStat>
}

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getHelsinkilDate(d = new Date()): string {
  return d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Helsinki' })
}

/** Apply hearts regen: 1 heart per 30 min elapsed, max 5. */
export function applyHeartsRegen(
  hearts: number,
  heartsLastRegenISO: string,
  now = new Date(),
): { hearts: number; heartsLastRegen: string } {
  if (hearts >= 5) return { hearts, heartsLastRegen: heartsLastRegenISO }
  const last = new Date(heartsLastRegenISO)
  const minutesPassed = (now.getTime() - last.getTime()) / 60_000
  const regensEarned = Math.floor(minutesPassed / 30)
  if (regensEarned <= 0) return { hearts, heartsLastRegen: heartsLastRegenISO }
  const newHearts = Math.min(5, hearts + regensEarned)
  const newLast = new Date(last.getTime() + regensEarned * 30 * 60_000)
  return { hearts: newHearts, heartsLastRegen: newLast.toISOString() }
}

// ─── Firestore operations ──────────────────────────────────────────────────

export async function ensureProfileDoc(uid: string): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'users', uid),
    {
      profile: { createdAt: serverTimestamp(), locale: 'fi' },
    },
    { merge: true },
  )
}

export async function loadUserDoc(uid: string): Promise<FirestoreUserDoc | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    const data = snap.data()
    // Firestore Timestamp → ISO string for heartsLastRegen
    if (data.progress?.heartsLastRegen instanceof Object && 'toDate' in data.progress.heartsLastRegen) {
      data.progress.heartsLastRegen = (data.progress.heartsLastRegen as Timestamp).toDate().toISOString()
    }
    return data as FirestoreUserDoc
  } catch {
    return null
  }
}

export async function saveProgress(uid: string, progress: Partial<FirestoreProgress>): Promise<void> {
  if (!db) return
  try {
    await setDoc(doc(db, 'users', uid), { progress }, { merge: true })
  } catch {
    // queued offline — Firestore SDK will retry
  }
}

export async function saveLevelStat(uid: string, levelId: string, stat: LevelStat): Promise<void> {
  if (!db) return
  try {
    await setDoc(doc(db, 'users', uid), { levelStats: { [levelId]: stat } }, { merge: true })
  } catch {
    // queued offline
  }
}
