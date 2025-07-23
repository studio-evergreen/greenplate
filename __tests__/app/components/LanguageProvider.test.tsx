import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import { LanguageProvider, useLanguage } from '@/app/components/LanguageProvider';
import { getCookie, setCookie, getLanguageCookie, setLanguageCookie } from '@/lib/utils/cookies';

// Mock the cookies utility
jest.mock('@/lib/utils/cookies', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  getLanguageCookie: jest.fn(),
  setLanguageCookie: jest.fn(),
}));

// Mock console.error to track missing translation warnings
const mockConsoleError = jest.fn();
const originalConsoleError = console.error;

// Test component that uses the translation hook
function TestComponent() {
  const { t, lang, setLang } = useLanguage();
  
  return (
    <div>
      <div data-testid="language">{lang}</div>
      <div data-testid="simple-translation">{t('topbar.signIn')}</div>
      <div data-testid="variable-translation">{t('message.welcome', { name: 'John' })}</div>
      <div data-testid="missing-translation">{t('nonexistent.key')}</div>
      <div data-testid="nested-translation">{t('consent.toastSavedAllTitle')}</div>
      <button onClick={() => setLang('ko')} data-testid="switch-to-korean">
        Switch to Korean
      </button>
      <button onClick={() => setLang('en')} data-testid="switch-to-english">
        Switch to English
      </button>
    </div>
  );
}

describe('LanguageProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = mockConsoleError;
    (getCookie as jest.Mock).mockReturnValue(null);
    (getLanguageCookie as jest.Mock).mockReturnValue('en');
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('provides default language (English) when no cookie is set', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });
  });

  it('loads saved language from cookie', async () => {
    (getLanguageCookie as jest.Mock).mockReturnValue('ko');

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('ko');
    });
  });

  it('translates simple keys correctly', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('simple-translation')).toHaveTextContent('Sign in');
    });
  });

  it('handles variable interpolation in translations', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('variable-translation')).toHaveTextContent('Welcome, John!');
    });
  });

  it('returns the key itself when translation is missing', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('missing-translation')).toHaveTextContent('nonexistent.key');
    });
  });

  it('handles nested translation keys', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('nested-translation')).toHaveTextContent('Cookie Settings Saved');
    });
  });

  it('switches language and updates translations', async () => {
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('simple-translation')).toHaveTextContent('Sign in');
    });

    // Switch to Korean
    await act(async () => {
      fireEvent.click(screen.getByTestId('switch-to-korean'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('ko');
      expect(screen.getByTestId('simple-translation')).toHaveTextContent('로그인');
    });

    // Verify cookie was set
    expect(setLanguageCookie).toHaveBeenCalledWith('ko');
  });

  it('handles Korean variable interpolation correctly', async () => {
    (getLanguageCookie as jest.Mock).mockReturnValue('ko');

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('variable-translation')).toHaveTextContent('John님, 환영합니다!');
    });
  });

  it('initializes with English language by default', async () => {  
    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });
  });

  it('falls back to English for invalid language in cookie', async () => {
    (getLanguageCookie as jest.Mock).mockReturnValue('en'); // getLanguageCookie handles the fallback

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });
  });

  it('handles translation loading error gracefully', async () => {
    // Mock dynamic import to fail
    const originalImport = (global as any).import;
    (global as any).import = jest.fn().mockRejectedValue(new Error('Failed to load'));

    await act(async () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );
    });

    await waitFor(() => {
      // Should fall back to English even if Korean fails to load
      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });

    (global as any).import = originalImport;
  });
});