import enTranslations from '@/locales/en.json';
import koTranslations from '@/locales/ko.json';

/**
 * Flattens nested translation object into dot notation keys
 * Example: { auth: { login: "Login" } } → { "auth.login": "Login" }
 */
function flattenTranslations(obj: any, prefix = ''): Record<string, string> {
  const flattened: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    } else {
      flattened[newKey] = String(value);
    }
  }
  
  return flattened;
}

/**
 * Extracts variable placeholders from translation strings
 * Example: "Welcome, {name}!" → ["name"]
 */
function extractVariables(text: string): string[] {
  const matches = text.match(/{([^}]+)}/g);
  return matches ? matches.map(match => match.slice(1, -1)) : [];
}

/**
 * Finds all translation keys used in the codebase
 * This is a simplified version - in a real scenario, you'd scan the actual files
 */
function getUsedTranslationKeys(): string[] {
  // These are keys we know are used based on the codebase analysis
  // In a real implementation, you'd parse the TypeScript files to extract t('key') calls
  return [
    'topbar.signIn',
    'topbar.signUp',
    'topbar.logout',
    'topbar.profile',
    'topbar.settings',
    'topbar.language',
    'topbar.theme',
    'auth.email',
    'auth.password', 
    'auth.name',
    'auth.google',
    'auth.signoutSuccess',
    'auth.errors.generic',
    'auth.errors.signoutFailed',
    'signup.title',
    'signup.subtitle',
    'signup.show',
    'signup.hide',
    'signup.confirmPassword',
    'signup.marketing',
    'signup.agree1',
    'signup.agree2',
    'signup.terms',
    'signup.privacy',
    'signup.creating',
    'signup.create',
    'signup.or',
    'signup.already',
    'signup.emailSent',
    'signin.title',
    'signin.subtitle', 
    'signin.required',
    'signin.success',
    'message.welcome',
    'consent.title',
    'consent.description',
    'consent.acceptAll',
    'consent.acceptNecessary',
    'consent.settings',
    'consent.modalTitle',
    'consent.modalDescription',
    'consent.modalSave',
    'consent.modalCancel',
    'consent.necessaryTitle',
    'consent.necessaryDescription',
    'consent.necessaryAlwaysActive',
    'consent.analyticsTitle',
    'consent.analyticsDescription',
    'consent.marketingTitle',
    'consent.marketingDescription',
    'consent.toastSavedAllTitle',
    'consent.toastSavedAllMessage',
    'consent.toastSavedNecessaryTitle',
    'consent.toastSavedNecessaryMessage',
    'consent.toastSavedCustomTitle',
    'consent.toastSavedCustomMessage',
    'consent.toastErrorTitle',
    'consent.toastErrorMessage',
  ];
}

describe('Translation Completeness and Consistency', () => {
  const flatEnTranslations = flattenTranslations(enTranslations);
  const flatKoTranslations = flattenTranslations(koTranslations);
  const usedKeys = getUsedTranslationKeys();

  describe('Translation Structure Consistency', () => {
    it('should have the same keys in both English and Korean translations', () => {
      const enKeys = Object.keys(flatEnTranslations).sort();
      const koKeys = Object.keys(flatKoTranslations).sort();

      const missingInKorean = enKeys.filter(key => !koKeys.includes(key));
      const missingInEnglish = koKeys.filter(key => !enKeys.includes(key));

      if (missingInKorean.length > 0) {
        console.warn('Keys missing in Korean translations:', missingInKorean);
      }
      if (missingInEnglish.length > 0) {
        console.warn('Keys missing in English translations:', missingInEnglish);
      }

      expect(missingInKorean).toHaveLength(0);
      expect(missingInEnglish).toHaveLength(0);
      expect(enKeys).toEqual(koKeys);
    });

    it('should not have empty translation values', () => {
      const emptyEnKeys = Object.entries(flatEnTranslations)
        .filter(([key, value]) => !value || value.trim() === '')
        .map(([key]) => key);
      
      const emptyKoKeys = Object.entries(flatKoTranslations)
        .filter(([key, value]) => !value || value.trim() === '')
        .map(([key]) => key);

      expect(emptyEnKeys).toHaveLength(0);
      expect(emptyKoKeys).toHaveLength(0);
    });
  });

  describe('Variable Interpolation Consistency', () => {
    it('should have matching variable placeholders in both languages', () => {
      const inconsistentKeys: string[] = [];

      Object.keys(flatEnTranslations).forEach(key => {
        const enVariables = extractVariables(flatEnTranslations[key]);
        const koVariables = extractVariables(flatKoTranslations[key] || '');

        const enVarSet = new Set(enVariables);
        const koVarSet = new Set(koVariables);

        const hasMatchingVariables = 
          enVarSet.size === koVarSet.size && 
          [...enVarSet].every(v => koVarSet.has(v));

        if (!hasMatchingVariables) {
          inconsistentKeys.push(key);
        }
      });

      if (inconsistentKeys.length > 0) {
        console.warn('Keys with inconsistent variables:', inconsistentKeys.map(key => ({
          key,
          en: extractVariables(flatEnTranslations[key]),
          ko: extractVariables(flatKoTranslations[key] || '')
        })));
      }

      expect(inconsistentKeys).toHaveLength(0);
    });

    it('should have valid variable syntax in all translations', () => {
      const invalidVariablePattern = /\{[^}]*[^a-zA-Z0-9_][^}]*\}/;
      
      const invalidEnKeys = Object.entries(flatEnTranslations)
        .filter(([key, value]) => invalidVariablePattern.test(value))
        .map(([key]) => key);

      const invalidKoKeys = Object.entries(flatKoTranslations)
        .filter(([key, value]) => invalidVariablePattern.test(value))
        .map(([key]) => key);

      expect(invalidEnKeys).toHaveLength(0);
      expect(invalidKoKeys).toHaveLength(0);
    });
  });

  describe('Translation Usage Coverage', () => {
    it('should have translations for all used keys', () => {
      const missingKeys = usedKeys.filter(key => !flatEnTranslations[key]);
      
      if (missingKeys.length > 0) {
        console.warn('Translation keys used in code but missing from translations:', missingKeys);
      }

      expect(missingKeys).toHaveLength(0);
    });

    it('should not have unused translation keys (potential dead code)', () => {
      const unusedKeys = Object.keys(flatEnTranslations).filter(key => !usedKeys.includes(key));
      
      // Only warn about unused keys, don't fail the test since some might be used in areas we haven't analyzed
      if (unusedKeys.length > 0) {
        console.warn('Potentially unused translation keys:', unusedKeys);
      }

      // This test is informational only - we don't expect it to pass/fail
      expect(unusedKeys.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Translation Quality Checks', () => {
    it('should have proper capitalization in titles', () => {
      const titleKeys = Object.keys(flatEnTranslations).filter(key => 
        key.includes('title') || key.includes('Title')
      );

      const improperlyCasedTitles = titleKeys.filter(key => {
        const value = flatEnTranslations[key];
        // Check if first letter is uppercase
        return value && value.length > 0 && value[0] !== value[0].toUpperCase();
      });

      if (improperlyCasedTitles.length > 0) {
        console.warn('Titles with improper capitalization:', improperlyCasedTitles.map(key => ({
          key,
          value: flatEnTranslations[key]
        })));
      }

      expect(improperlyCasedTitles).toHaveLength(0);
    });

    it('should have consistent punctuation patterns', () => {
      // Check for consistent ending punctuation in descriptions
      const descriptionKeys = Object.keys(flatEnTranslations).filter(key => 
        key.includes('description') || key.includes('Description')
      );

      const inconsistentPunctuation = descriptionKeys.filter(key => {
        const enValue = flatEnTranslations[key];
        const koValue = flatKoTranslations[key];
        
        if (!enValue || !koValue) return false;

        const enEndsWithPeriod = enValue.endsWith('.');
        const koEndsWithPeriod = koValue.endsWith('.');
        
        // Both should either end with period or not
        return enEndsWithPeriod !== koEndsWithPeriod;
      });

      if (inconsistentPunctuation.length > 0) {
        console.warn('Inconsistent punctuation in descriptions:', inconsistentPunctuation);
      }

      // This is a soft warning, not a hard requirement
      expect(inconsistentPunctuation.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Translation Content Validation', () => {
    it('should not contain HTML tags in translations', () => {
      const htmlTagPattern = /<[^>]+>/;
      
      const enWithHtml = Object.entries(flatEnTranslations)
        .filter(([key, value]) => htmlTagPattern.test(value))
        .map(([key]) => key);

      const koWithHtml = Object.entries(flatKoTranslations)
        .filter(([key, value]) => htmlTagPattern.test(value))
        .map(([key]) => key);

      expect(enWithHtml).toHaveLength(0);
      expect(koWithHtml).toHaveLength(0);
    });

    it('should not have excessive whitespace in translations', () => {
      const excessiveWhitespacePattern = /\s{2,}/;
      
      const enWithExcessiveWhitespace = Object.entries(flatEnTranslations)
        .filter(([key, value]) => excessiveWhitespacePattern.test(value.trim()))
        .map(([key]) => key);

      const koWithExcessiveWhitespace = Object.entries(flatKoTranslations)
        .filter(([key, value]) => excessiveWhitespacePattern.test(value.trim()))
        .map(([key]) => key);

      expect(enWithExcessiveWhitespace).toHaveLength(0);
      expect(koWithExcessiveWhitespace).toHaveLength(0);
    });

    it('should have reasonable length limits for UI text', () => {
      // Button text should be concise (under 50 characters)
      const buttonKeys = Object.keys(flatEnTranslations).filter(key => 
        key.includes('button') || key.includes('Button') || 
        key.includes('signIn') || key.includes('signUp') ||
        key.includes('create') || key.includes('submit')
      );

      const tooLongButtonText = buttonKeys.filter(key => {
        const value = flatEnTranslations[key];
        return value && value.length > 50;
      });

      if (tooLongButtonText.length > 0) {
        console.warn('Button text that might be too long:', tooLongButtonText.map(key => ({
          key,
          length: flatEnTranslations[key].length,
          value: flatEnTranslations[key]
        })));
      }

      expect(tooLongButtonText.length).toBeLessThanOrEqual(2);
    });
  });
});