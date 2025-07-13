export type Language = 'en' | 'ko';
export type Theme = 'light' | 'dark';

export function isValidLanguage(value: unknown): value is Language {
  return typeof value === 'string' && ['en', 'ko'].includes(value);
}

export function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && ['light', 'dark'].includes(value);
}

export function isValidEmail(email: string): boolean {
  // More strict email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  // Additional checks for edge cases
  if (!email || email.length > 254) return false;
  if (email.includes('..')) return false; // consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false;
  
  return emailRegex.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function assertIsString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
}

export function assertIsNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  assertIsString(value, fieldName);
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
}