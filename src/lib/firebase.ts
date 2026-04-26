import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type Auth,
  type User,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'

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

export async function ensureProfileDoc(uid: string): Promise<void> {
  if (!db) return
  await setDoc(
    doc(db, 'users', uid),
    {
      profile: {
        createdAt: serverTimestamp(),
        locale: 'fi',
      },
    },
    { merge: true },
  )
}
