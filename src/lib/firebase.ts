import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const metaEnv = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY,
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: metaEnv.VITE_FIREBASE_APP_ID
};

export const hasFirebaseConfig = !!metaEnv.VITE_FIREBASE_API_KEY;

// To ensure the application does not crash on startup if environment variables
// are not yet set in the AI Studio environment, we fall back to the default credentials.
const safeConfig = hasFirebaseConfig ? firebaseConfig : {
  apiKey: "AIzaSyAJHQ0gDfqg4UGFlQw-k0xWccEGhk_yd5g",
  authDomain: "gigcash-app.firebaseapp.com",
  projectId: "gigcash-app",
  storageBucket: "gigcash-app.firebasestorage.app",
  messagingSenderId: "1006219348526",
  appId: "1:1006219348526:web:ba031c33bbdd8b276cadbf"
};

const app = initializeApp(safeConfig);
export const auth = getAuth(app);

