import { handleAuthError } from '@/lib/utils/auth-errors';

describe('auth error handling', () => {
  it('should handle null/undefined errors', () => {
    const result = handleAuthError(null);
    expect(result.message).toBe('An unknown error occurred');
    expect(result.translationKey).toBe('auth.errors.unknown');
    expect(result.isRetryable).toBe(true);
  });

  it('should handle invalid login credentials', () => {
    const error = new Error('Invalid login credentials');
    const result = handleAuthError(error);
    expect(result.message).toBe('Invalid email or password');
    expect(result.translationKey).toBe('auth.errors.invalidCredentials');
    expect(result.isRetryable).toBe(false);
  });

  it('should handle email not confirmed', () => {
    const error = new Error('Email not confirmed');
    const result = handleAuthError(error);
    expect(result.message).toBe('Please check your email and confirm your account');
    expect(result.translationKey).toBe('auth.errors.emailNotConfirmed');
    expect(result.isRetryable).toBe(false);
  });

  it('should handle user already registered', () => {
    const error = new Error('User already registered');
    const result = handleAuthError(error);
    expect(result.message).toBe('An account with this email already exists');
    expect(result.translationKey).toBe('auth.errors.userExists');
    expect(result.isRetryable).toBe(false);
  });

  it('should handle password too short', () => {
    const error = new Error('Password should be at least 8 characters');
    const result = handleAuthError(error);
    expect(result.message).toBe('Password must be at least 8 characters long');
    expect(result.translationKey).toBe('auth.errors.passwordTooShort');
    expect(result.isRetryable).toBe(false);
  });

  it('should handle invalid email', () => {
    const error = new Error('Invalid email format');
    const result = handleAuthError(error);
    expect(result.message).toBe('Please enter a valid email address');
    expect(result.translationKey).toBe('auth.errors.invalidEmail');
    expect(result.isRetryable).toBe(false);
  });

  it('should handle network errors', () => {
    const error = new Error('Network connection failed');
    const result = handleAuthError(error);
    expect(result.message).toBe('Network error. Please check your connection and try again');
    expect(result.translationKey).toBe('auth.errors.network');
    expect(result.isRetryable).toBe(true);
  });

  it('should handle rate limiting', () => {
    const error = new Error('Rate limit exceeded');
    const result = handleAuthError(error);
    expect(result.message).toBe('Too many attempts. Please try again later');
    expect(result.translationKey).toBe('auth.errors.rateLimit');
    expect(result.isRetryable).toBe(true);
  });

  it('should handle generic errors', () => {
    const error = new Error('Some unknown error');
    const result = handleAuthError(error);
    expect(result.message).toBe('Some unknown error');
    expect(result.translationKey).toBe('auth.errors.generic');
    expect(result.isRetryable).toBe(true);
  });

  it('should handle string errors', () => {
    const result = handleAuthError('String error message');
    expect(result.message).toBe('String error message');
    expect(result.translationKey).toBe('auth.errors.generic');
    expect(result.isRetryable).toBe(true);
  });
});