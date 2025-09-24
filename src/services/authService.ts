import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
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
  private storage;

  constructor() {
    this.isLocalDev = import.meta.env.DEV;
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
    this.storage = getStorage();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    if (this.isLocalDev) {
      return this.localLogin(email, password);
    } else {
      return this.iamLogin(email, password);
    }
  }

  async signup(email: string, password: string, name: string, avatarFile?: File | null): Promise<AuthResponse> {
    if (this.isLocalDev) {
      return this.localSignup(email, password, name, avatarFile);
    } else {
      return this.iamSignup(email, password, name, avatarFile);
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

      const photoUrl =await this.getPhotoUrlByFirebaseUid(user.uid);
     
      // Send Firebase ID token to backend for post-login updates/sync
      try {
        const idToken = await user.getIdToken(true);
        await this.notifyLoginWithToken(idToken);
      } catch (tokenSyncError) {
        console.error('Failed to sync login with backend', tokenSyncError);
        // Do not block user login if backend sync fails
      }
     
      
      return {
        user: {
          id: user.uid,
          email: user.email!,
          name: user.displayName || undefined,
          avatar: photoUrl || undefined,
        },
      };
    } catch (error) {
      return { user: null, error: 'Invalid credentials' };
    }
  }

  private async uploadAvatar(file: File, userId: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("firebaseUserId", userId);

    const response = await fetch(`${this.apiBaseUrl}/api/avatars/upload`, {
      method: "POST",
      body: formData,
    });

  return await response.text(); // this will be avatar URL
  }

  private async localSignup(email: string, password: string, name: string, avatarFile?: File | null): Promise<AuthResponse> {
    try {
      // For local development, we'll create a temporary user ID for avatar upload
      const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      let avatarUrl: string | undefined;

      // Upload avatar if provided
      if (avatarFile) {
        try {
          avatarUrl = await this.uploadAvatar(avatarFile, tempUserId);
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          return { user: null, error: 'Failed to upload avatar. Please try again.' };
        }
      }

      const response = await fetch('/api/auth/local/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name, avatar: avatarUrl }),
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

  private async iamSignup(email: string, password: string, name: string, avatarFile?: File | null): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      let avatarUrl: string | undefined;

      // Upload avatar if provided
      if (avatarFile) {
        try {
          avatarUrl = await this.uploadAvatar(avatarFile, userCredential.user.uid);
        } catch (uploadError) {
          console.error('Avatar upload failed:', uploadError);
          // Continue with signup even if avatar upload fails
        }
      }
      
      // Update display name and photo URL
      const updateData: any = { displayName: name };
      if (avatarUrl) {
        updateData.photoURL = avatarUrl;
      }
      await updateProfile(userCredential.user, updateData);

      try {
        await this.createUserInDatabase({
          id: userCredential.user.uid,
          email: userCredential.user.email!,
          name: name,
          avatar: avatarUrl || userCredential.user.photoURL || undefined,
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

  private async getPhotoUrlByFirebaseUid(firebaseUserId: string): Promise<string> {
    console.log(`${this.apiBaseUrl}`);
  
    const response = await fetch(`${this.apiBaseUrl}/api/avatars/photo-url/${firebaseUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to fetch photo url: ${errorData.message || 'Unknown error'}`);
    }
  
    const data = await response.text(); // since backend returns string
    return data;
  }
  
  
  // Notify backend about successful login using Firebase ID token
  private async notifyLoginWithToken(idToken: string): Promise<void> {
    if (!this.apiBaseUrl) return; // Skip if backend base URL is not configured
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Backend login sync failed:', response.status, errorText);
      }
    } catch (err) {
      console.error('Error calling backend for login sync:', err);
    }
  }
  
  }

export const authService = new AuthService();