import type { FirebaseOptions } from 'firebase/app';

/**
 * Firebase **Web** client configuration.
 *
 * - This file does **not** contain secret strings — only reads env vars.
 * - Names starting with `NEXT_PUBLIC_` are inlined into the browser bundle at build time.
 *   That is how Firebase’s **client** SDK is meant to work: the “API key” is a **project
 *   identifier**, not a private server secret. Lock it down in Google Cloud Console
 *   (HTTP referrer + API restrictions) and rely on Firestore / Auth rules for data access.
 * - Put values in `.env` locally; never paste keys as literals here or commit `.env`.
 *
 * @see https://firebase.google.com/docs/projects/api-keys
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
