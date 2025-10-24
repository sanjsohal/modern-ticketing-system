import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ENV, validateEnv } from './env';

// Validate environment variables on initialization
if (!validateEnv()) {
  console.error('❌ Firebase configuration is incomplete. Please check your .env.local file.');
}


const firebaseConfig = {
  apiKey: ENV.FIREBASE.API_KEY,
  authDomain: ENV.FIREBASE.AUTH_DOMAIN,
  projectId: ENV.FIREBASE.PROJECT_ID,
  storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE.APP_ID,
  measurementId: ENV.FIREBASE.MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 