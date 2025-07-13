import { validateSignupForm, validateSigninForm } from '@/lib/utils/form-validation';

describe('form validation utilities', () => {
  describe('validateSignupForm', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      confirm: 'password123',
      agreed: true,
    };

    it('should return valid for correct data', () => {
      const result = validateSignupForm(validData);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when terms not agreed', () => {
      const result = validateSignupForm({ ...validData, agreed: false });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.termsRequired');
    });

    it('should return invalid when fields are empty', () => {
      const result = validateSignupForm({ ...validData, name: '' });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.allFieldsRequired');
    });

    it('should return invalid for invalid email', () => {
      const result = validateSignupForm({ ...validData, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.invalidEmail');
    });

    it('should return invalid for short password', () => {
      const result = validateSignupForm({ 
        ...validData, 
        password: 'short', 
        confirm: 'short' 
      });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.passwordTooShort');
    });

    it('should return invalid when passwords do not match', () => {
      const result = validateSignupForm({ 
        ...validData, 
        confirm: 'different-password' 
      });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.passwordMismatch');
    });
  });

  describe('validateSigninForm', () => {
    const validData = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should return valid for correct data', () => {
      const result = validateSigninForm(validData);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should return invalid when fields are empty', () => {
      const result = validateSigninForm({ ...validData, email: '' });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.allFieldsRequired');
    });

    it('should return invalid for invalid email', () => {
      const result = validateSigninForm({ ...validData, email: 'invalid-email' });
      expect(result.isValid).toBe(false);
      expect(result.translationKey).toBe('auth.errors.invalidEmail');
    });
  });
});