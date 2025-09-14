import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error?: string;
  emailVerificationSent?: boolean;
}

class AuthService {
  private isLocalDev: boolean;
  private apiBaseUrl: string;

  constructor() {
    this.isLocalDev = import.meta.env.DEV;
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
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
      const response = await fetch('/api/auth/local/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403 && errorData.emailNotVerified) {
          return { user: null, error: 'Please verify your email before logging in' };
        }
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Sign out the user immediately since they shouldn't be logged in
        await auth.signOut();
        return { 
          user: null, 
          error: 'Please verify your email before logging in. Check your inbox for the verification link.' 
        };
      }
      
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

      return { 
        user: null, // Don't return user until email is verified
        emailVerificationSent: true,
        error: 'Account created! Please check your email and click the verification link to complete registration.'
      };
    } catch (error) {
      return { user: null, error: 'Failed to create account' };
    }
  }

  private async iamSignup(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }

      try {
        await this.createUserInDatabase({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name,
          avatar: userCredential.user.photoURL || undefined,
        })
      } catch (error) {
        console.error('Failed to create user in database', error);
      }
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Sign out the user immediately - they can't use the app until verified
      await auth.signOut();
      
      return {
        user: null, // Don't return user until email is verified
        emailVerificationSent: true,
        error: 'Account created! Please check your email and click the verification link to complete registration.'
      };
    } catch (error: any) {
      let errorMessage = 'Failed to create account';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address';
      }
      
      return { user: null, error: errorMessage };
    }
  }

  private async localLogout(): Promise<void> {
    await fetch('/api/auth/local/logout', { method: 'POST' });
  }

  private async iamLogout(): Promise<void> {
    await auth.signOut();
  }

  // Helper method to resend verification email
  async resendVerificationEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!this.isLocalDev) {
      try {
        // Sign in temporarily to resend verification
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (userCredential.user.emailVerified) {
          await auth.signOut();
          return { success: false, error: 'Email is already verified. You can now log in.' };
        }
        
        await sendEmailVerification(userCredential.user);
        await auth.signOut();
        
        return { success: true };
      } catch (error) {
        return { success: false, error: 'Failed to resend verification email. Please check your credentials.' };
      }
    } else {
      try {
        const response = await fetch('/api/auth/local/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        
        if (response.ok) {
          return { success: true };
        } else {
          return { success: false, error: 'Failed to resend verification email' };
        }
      } catch (error) {
        return { success: false, error: 'Failed to resend verification email' };
      }
    }
  }

  private async createUserInDatabase(user: AuthUser): Promise<void> {
    const response = await fetch(`${this.apiBaseUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firebaseUid: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: false, // Will be updated when email is verified
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Database user creation failed: ${errorData.message || 'Unknown error'}`);
    }
  }
  }

export const authService = new AuthService();