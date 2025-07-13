import { AuthError } from '@supabase/supabase-js';

export interface AuthErrorInfo {
  message: string;
  translationKey?: string;
  isRetryable: boolean;
}

export function handleAuthError(error: AuthError | Error | unknown): AuthErrorInfo {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      translationKey: 'auth.errors.unknown',
      isRetryable: true,
    };
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Supabase specific error patterns
  if (errorMessage.includes('Invalid login credentials')) {
    return {
      message: 'Invalid email or password',
      translationKey: 'auth.errors.invalidCredentials',
      isRetryable: false,
    };
  }
  
  if (errorMessage.includes('Email not confirmed')) {
    return {
      message: 'Please check your email and confirm your account',
      translationKey: 'auth.errors.emailNotConfirmed',
      isRetryable: false,
    };
  }
  
  if (errorMessage.includes('User already registered')) {
    return {
      message: 'An account with this email already exists',
      translationKey: 'auth.errors.userExists',
      isRetryable: false,
    };
  }
  
  if (errorMessage.includes('Password should be at least')) {
    return {
      message: 'Password must be at least 8 characters long',
      translationKey: 'auth.errors.passwordTooShort',
      isRetryable: false,
    };
  }
  
  if (errorMessage.includes('Invalid email')) {
    return {
      message: 'Please enter a valid email address',
      translationKey: 'auth.errors.invalidEmail',
      isRetryable: false,
    };
  }
  
  if (errorMessage.includes('Network')) {
    return {
      message: 'Network error. Please check your connection and try again',
      translationKey: 'auth.errors.network',
      isRetryable: true,
    };
  }
  
  if (errorMessage.includes('Rate limit')) {
    return {
      message: 'Too many attempts. Please try again later',
      translationKey: 'auth.errors.rateLimit',
      isRetryable: true,
    };
  }
  
  // Default fallback
  return {
    message: errorMessage || 'An unexpected error occurred',
    translationKey: 'auth.errors.generic',
    isRetryable: true,
  };
}