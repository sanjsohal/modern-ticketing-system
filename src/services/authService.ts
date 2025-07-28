import {  signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthResponse {
  user: AuthUser | null;
  error?: string;
}

class AuthService {
  private isLocalDev: boolean;

  constructor() {
    this.isLocalDev = import.meta.env.DEV;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (this.isLocalDev) {
      return this.localLogin(email, password);
    } else {
      return this.iamLogin(email, password);
    }
  }

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    if (this.isLocalDev) {
      return this.localSignup(email, password, name);
    } else {
      return this.iamSignup(email, password, name);
    }
  }

  async logout(): Promise<void> {
    if (this.isLocalDev) {
      return this.localLogout();
    } else {
      return this.iamLogout();
    }
  }

  private async localLogin(email: string, password: string): Promise<AuthResponse> {
    try {
      // Here you would implement your local database authentication
      // For example, using a local API endpoint that checks against your database
      const response = await fetch('/api/auth/local/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return { user: data.user };
    } catch (error) {
      return { user: null, error: 'Invalid credentials' };
    }
  }

  private async iamLogin(email: string, password: string): Promise<AuthResponse> {
    try {
      // Use existing Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return {
        user: {
          id: user.uid,
          email: user.email!,
          name: user.displayName || undefined,
          avatar: user.photoURL || undefined,
        },
      };
    } catch (error) {
      return { user: null, error: 'Invalid credentials' };
    }
  }

  private async localSignup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Implement local database signup
      const response = await fetch('/api/auth/local/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      return { user: data.user };
    } catch (error) {
      return { user: null, error: 'Failed to create account' };
    }
  }

  private async iamSignup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // Use existing Firebase authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      alert('Verification email sent. Please check your inbox.');
      return {
        user: {
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name,
          avatar: userCredential.user.photoURL || undefined,
        }
      };
    } catch (error) {
      return { user: null, error: 'Failed to create account' };
    }
  }

  private async localLogout(): Promise<void> {
    // Implement local logout logic
    await fetch('/api/auth/local/logout', { method: 'POST' });
  }

  private async iamLogout(): Promise<void> {
    // Use existing Firebase logout
    await auth.signOut();
  }
}

export const authService = new AuthService(); 