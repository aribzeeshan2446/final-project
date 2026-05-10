import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase Web SDK config from env (never hardcode API keys in source).
 * Set NEXT_PUBLIC_FIREBASE_* in .env — see .env.example.
 */
export function getFirebaseConfig(): FirebaseOptions {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
  const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? '';

  if (!apiKey || !authDomain || !projectId || !messagingSenderId || !appId) {
    throw new Error(
      'Missing Firebase env vars. Copy .env.example to .env and set NEXT_PUBLIC_FIREBASE_* from Firebase Console → Project settings → Your apps.',
    );
  }

  return {
    apiKey,
    authDomain,
    projectId,
    messagingSenderId,
    appId,
    measurementId,
  };
}
