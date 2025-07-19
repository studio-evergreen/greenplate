import { 
  getCookie, 
  setCookie, 
  getLanguageCookie, 
  setLanguageCookie, 
  getThemeCookie, 
  setThemeCookie 
} from '@/lib/utils/cookies';

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

// Helper to reset document.cookie
const resetCookies = () => {
  document.cookie = '';
};

describe('Cookie Utils', () => {
  beforeEach(() => {
    resetCookies();
  });

  describe('setCookie', () => {
    it('should set a basic cookie', () => {
      setCookie('testKey', 'testValue');
      expect(document.cookie).toContain('testKey=testValue');
    });

    it('should set a cookie with expiry days', () => {
      setCookie('testKey', 'testValue', 7);
      expect(document.cookie).toContain('testKey=testValue');
      expect(document.cookie).toContain('expires=');
    });

    it('should set cookie with default 365 days expiry', () => {
      setCookie('testKey', 'testValue');
      expect(document.cookie).toContain('testKey=testValue');
      expect(document.cookie).toContain('expires=');
    });

    it('should handle special characters in cookie value', () => {
      setCookie('testKey', 'test value with spaces');
      expect(document.cookie).toContain('testKey=test value with spaces');
    });

    it('should set cookie with SameSite and path attributes', () => {
      setCookie('testKey', 'testValue');
      expect(document.cookie).toContain('path=/');
      expect(document.cookie).toContain('SameSite=Lax');
    });

    it('should handle undefined document gracefully', () => {
      const originalDocument = global.document;
      // @ts-ignore
      delete global.document;
      
      expect(() => setCookie('test', 'value')).not.toThrow();
      
      global.document = originalDocument;
    });
  });

  describe('getCookie', () => {
    it('should return undefined for non-existent cookie', () => {
      const result = getCookie('nonExistent');
      expect(result).toBeUndefined();
    });

    it('should return cookie value for existing cookie', () => {
      // Manually set cookie for testing
      document.cookie = 'testKey=testValue';
      const result = getCookie('testKey');
      expect(result).toBe('testValue');
    });

    it('should handle multiple cookies', () => {
      document.cookie = 'key1=value1; key2=value2; key3=value3';
      expect(getCookie('key1')).toBe('value1');
      expect(getCookie('key2')).toBe('value2');
      expect(getCookie('key3')).toBe('value3');
    });

    it('should handle cookies with similar names', () => {
      document.cookie = 'test=value1; test_extended=value2';
      expect(getCookie('test')).toBe('value1');
      expect(getCookie('test_extended')).toBe('value2');
    });

    it('should return undefined when document is not available', () => {
      const originalDocument = global.document;
      // @ts-ignore
      delete global.document;
      
      const result = getCookie('test');
      expect(result).toBeUndefined();
      
      global.document = originalDocument;
    });

    it('should handle malformed cookie strings gracefully', () => {
      document.cookie = 'malformed;cookie;string';
      const result = getCookie('malformed');
      expect(result).toBeUndefined();
    });

    it('should handle empty cookie values', () => {
      document.cookie = 'emptyKey=; normalKey=value';
      expect(getCookie('emptyKey')).toBe('');
      expect(getCookie('normalKey')).toBe('value');
    });
  });

  describe('getLanguageCookie', () => {
    it('should return default language when no cookie exists', () => {
      const result = getLanguageCookie();
      expect(result).toBe('en');
    });

    it('should return language from cookie when valid', () => {
      document.cookie = 'language=ko';
      const result = getLanguageCookie();
      expect(result).toBe('ko');
    });

    it('should return default language when cookie value is invalid', () => {
      document.cookie = 'language=invalid';
      const result = getLanguageCookie();
      expect(result).toBe('en');
    });

    it('should handle valid language values', () => {
      document.cookie = 'language=ko';
      expect(getLanguageCookie()).toBe('ko');
      
      document.cookie = 'language=en';
      expect(getLanguageCookie()).toBe('en');
    });
  });

  describe('setLanguageCookie', () => {
    it('should set language cookie', () => {
      setLanguageCookie('ko');
      expect(document.cookie).toContain('language=ko');
    });

    it('should set English language cookie', () => {
      setLanguageCookie('en');
      expect(document.cookie).toContain('language=en');
    });
  });

  describe('getThemeCookie', () => {
    it('should return default theme when no cookie exists', () => {
      const result = getThemeCookie();
      expect(result).toBe('light');
    });

    it('should return theme from cookie when valid', () => {
      document.cookie = 'theme=dark';
      const result = getThemeCookie();
      expect(result).toBe('dark');
    });

    it('should return default theme when cookie value is invalid', () => {
      document.cookie = 'theme=invalid';
      const result = getThemeCookie();
      expect(result).toBe('light');
    });

    it('should handle all valid theme values', () => {
      document.cookie = 'theme=light';
      expect(getThemeCookie()).toBe('light');
      
      document.cookie = 'theme=dark';
      expect(getThemeCookie()).toBe('dark');
      
      document.cookie = 'theme=system';
      expect(getThemeCookie()).toBe('system');
    });
  });

  describe('setThemeCookie', () => {
    it('should set theme cookie to light', () => {
      setThemeCookie('light');
      expect(document.cookie).toContain('theme=light');
    });

    it('should set theme cookie to dark', () => {
      setThemeCookie('dark');
      expect(document.cookie).toContain('theme=dark');
    });

    it('should set theme cookie to system', () => {
      setThemeCookie('system');
      expect(document.cookie).toContain('theme=system');
    });
  });

  describe('Error handling', () => {
    it('should handle cookie access errors gracefully', () => {
      // Mock console.warn to verify error handling
      const originalWarn = console.warn;
      console.warn = jest.fn();

      // Mock document.cookie to throw an error
      Object.defineProperty(document, 'cookie', {
        get: () => {
          throw new Error('Cookie access denied');
        },
        set: () => {
          throw new Error('Cookie setting denied');
        },
        configurable: true,
      });

      expect(() => getCookie('test')).not.toThrow();
      expect(() => setCookie('test', 'value')).not.toThrow();

      expect(console.warn).toHaveBeenCalled();

      // Restore
      console.warn = originalWarn;
      Object.defineProperty(document, 'cookie', {
        writable: true,
        value: '',
      });
    });
  });
});