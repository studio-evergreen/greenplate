import { 
  isValidLanguage, 
  isValidTheme, 
  isValidEmail, 
  isValidPassword,
  assertIsString,
  assertIsNonEmptyString 
} from '@/lib/utils/validation';

describe('validation utilities', () => {
  describe('isValidLanguage', () => {
    it('should return true for valid languages', () => {
      expect(isValidLanguage('en')).toBe(true);
      expect(isValidLanguage('ko')).toBe(true);
    });

    it('should return false for invalid languages', () => {
      expect(isValidLanguage('fr')).toBe(false);
      expect(isValidLanguage('es')).toBe(false);
      expect(isValidLanguage('')).toBe(false);
      expect(isValidLanguage(null)).toBe(false);
      expect(isValidLanguage(undefined)).toBe(false);
      expect(isValidLanguage(123)).toBe(false);
    });
  });

  describe('isValidTheme', () => {
    it('should return true for valid themes', () => {
      expect(isValidTheme('light')).toBe(true);
      expect(isValidTheme('dark')).toBe(true);
    });

    it('should return false for invalid themes', () => {
      expect(isValidTheme('blue')).toBe(false);
      expect(isValidTheme('')).toBe(false);
      expect(isValidTheme(null)).toBe(false);
      expect(isValidTheme(undefined)).toBe(false);
      expect(isValidTheme(123)).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('test..email@example.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('12345678')).toBe(true);
      expect(isValidPassword('very-long-password')).toBe(true);
    });

    it('should return false for invalid passwords', () => {
      expect(isValidPassword('short')).toBe(false);
      expect(isValidPassword('1234567')).toBe(false);
      expect(isValidPassword('')).toBe(false);
    });
  });

  describe('assertIsString', () => {
    it('should not throw for valid strings', () => {
      expect(() => assertIsString('test', 'field')).not.toThrow();
      expect(() => assertIsString('', 'field')).not.toThrow();
    });

    it('should throw for non-strings', () => {
      expect(() => assertIsString(123, 'field')).toThrow('field must be a string');
      expect(() => assertIsString(null, 'field')).toThrow('field must be a string');
      expect(() => assertIsString(undefined, 'field')).toThrow('field must be a string');
    });
  });

  describe('assertIsNonEmptyString', () => {
    it('should not throw for non-empty strings', () => {
      expect(() => assertIsNonEmptyString('test', 'field')).not.toThrow();
      expect(() => assertIsNonEmptyString('  content  ', 'field')).not.toThrow();
    });

    it('should throw for empty strings', () => {
      expect(() => assertIsNonEmptyString('', 'field')).toThrow('field cannot be empty');
      expect(() => assertIsNonEmptyString('   ', 'field')).toThrow('field cannot be empty');
    });

    it('should throw for non-strings', () => {
      expect(() => assertIsNonEmptyString(123, 'field')).toThrow('field must be a string');
    });
  });
});