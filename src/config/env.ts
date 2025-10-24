/**
 * Environment configuration utilities
 * Provides type-safe access to environment variables
 */

export const ENV = {
  // Environment type
  MODE: import.meta.env.MODE, // 'development' | 'production'
  ENV: import.meta.env.VITE_ENV || 'local',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // Firebase Configuration
  FIREBASE: {
    API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    MEASUREMENT_ID: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },

  // API Configuration
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',

  // Feature Flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  // Idle Timeout Configuration (converted to milliseconds)
  IDLE_TIMEOUT: (parseInt(import.meta.env.VITE_IDLE_TIMEOUT) || 15) * 60 * 1000,
  IDLE_WARNING_TIME: (parseInt(import.meta.env.VITE_IDLE_WARNING_TIME) || 1) * 60 * 1000,
} as const;

/**
 * Validates that all required environment variables are present
 */
export const validateEnv = (): boolean => {
  const required = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
    'VITE_API_URL',
  ];

  const missing = required.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }

  return true;
};


