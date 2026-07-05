import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { apiRequest } from '../../../shared/services/api'
import type { BackendProfile } from '../types/auth.types'

function getEnvValue(key: string) {
  const value = import.meta.env[key]

  if (!value) {
    throw new Error(`Falta la variable de entorno ${key}.`)
  }

  return value
}

const firebaseConfig = {
  apiKey: getEnvValue('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvValue('VITE_FIREBASE_PROJECT_ID'),
  appId: getEnvValue('VITE_FIREBASE_APP_ID'),
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
}

const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const provider = new GoogleAuthProvider()

provider.setCustomParameters({
  hd: 'unal.edu.co',
  prompt: 'select_account',
})

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider)
  return result.user
}

export async function signOutUser() {
  await signOut(auth)
}

export async function getIdToken(forceRefresh = false) {
  if (!auth.currentUser) {
    return null
  }

  return auth.currentUser.getIdToken(forceRefresh)
}

export async function fetchMyProfile(token: string) {
  return apiRequest<BackendProfile>('/users/me/', {
    method: 'GET',
    token,
  })
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void | Promise<void>,
) {
  return onAuthStateChanged(auth, callback)
}

export { auth }