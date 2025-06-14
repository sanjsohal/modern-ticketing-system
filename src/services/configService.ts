interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

let cachedConfig: FirebaseConfig | null = null;

export const getFirebaseConfig = async (): Promise<FirebaseConfig> => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    // In production, this would be your secure backend endpoint
    const response = await fetch('/api/config/firebase');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase configuration');
    }
    
    const config = await response.json();
    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error fetching Firebase configuration:', error);
    throw error;
  }
}; 