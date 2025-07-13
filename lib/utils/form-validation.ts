import { isValidEmail, isValidPassword } from './validation';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  translationKey?: string;
}

export function validateSignupForm(data: {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agreed: boolean;
}): ValidationResult {
  const { name, email, password, confirm, agreed } = data;

  if (!agreed) {
    return {
      isValid: false,
      error: "You must agree to the Terms and Privacy Policy.",
      translationKey: "auth.errors.termsRequired"
    };
  }

  if (!name?.trim() || !email?.trim() || !password?.trim() || !confirm?.trim()) {
    return {
      isValid: false,
      error: "All fields are required.",
      translationKey: "auth.errors.allFieldsRequired"
    };
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
      translationKey: "auth.errors.invalidEmail"
    };
  }

  if (!isValidPassword(password)) {
    return {
      isValid: false,
      error: "Password must be at least 8 characters.",
      translationKey: "auth.errors.passwordTooShort"
    };
  }

  if (password !== confirm) {
    return {
      isValid: false,
      error: "Passwords do not match.",
      translationKey: "auth.errors.passwordMismatch"
    };
  }

  return { isValid: true };
}

export function validateSigninForm(data: {
  email: string;
  password: string;
}): ValidationResult {
  const { email, password } = data;

  if (!email?.trim() || !password?.trim()) {
    return {
      isValid: false,
      error: "All fields are required.",
      translationKey: "auth.errors.allFieldsRequired"
    };
  }

  if (!isValidEmail(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address.",
      translationKey: "auth.errors.invalidEmail"
    };
  }

  return { isValid: true };
}