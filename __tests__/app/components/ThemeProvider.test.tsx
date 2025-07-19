import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/app/components/ThemeProvider';

// Mock cookies utility
jest.mock('@/lib/utils/cookies', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
}));

// Test component to access theme context
const TestComponent = () => {
  const { theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
    </div>
  );
};

const { getCookie, setCookie } = require('@/lib/utils/cookies');

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset document class
    document.documentElement.className = '';
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should render children and provide theme context', () => {
    getCookie.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('light');
  });

  it('should default to system theme when no cookie exists', () => {
    getCookie.mockReturnValue(null);
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });

  it('should use cookie value when available', () => {
    getCookie.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
  });

  it('should update theme and save to cookie', () => {
    getCookie.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByTestId('set-dark').click();
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    expect(setCookie).toHaveBeenCalledWith('theme', 'dark', 365);
  });

  it('should apply dark class to documentElement when theme is dark', () => {
    getCookie.mockReturnValue('dark');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when theme is light', () => {
    getCookie.mockReturnValue('light');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('should handle system theme preference', () => {
    getCookie.mockReturnValue('system');
    
    // Mock system preference as dark
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    });

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should listen to system theme changes when theme is system', () => {
    getCookie.mockReturnValue('system');
    
    const mockMatchMedia = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    expect(mockMatchMedia.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should update document class when system preference changes', () => {
    getCookie.mockReturnValue('system');
    
    let changeHandler: (e: MediaQueryListEvent) => void;
    const mockMatchMedia = {
      matches: false,
      addEventListener: jest.fn().mockImplementation((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      }),
      removeEventListener: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Initially light
    expect(document.documentElement.classList.contains('dark')).toBe(false);

    // Simulate system preference change to dark
    act(() => {
      changeHandler({ matches: true } as MediaQueryListEvent);
    });

    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    getCookie.mockReturnValue('system');
    
    const mockMatchMedia = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    const { unmount } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    unmount();

    expect(mockMatchMedia.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });

  it('should handle invalid theme values gracefully', () => {
    getCookie.mockReturnValue('invalid-theme');
    
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    // Should fallback to system
    expect(screen.getByTestId('current-theme')).toHaveTextContent('system');
  });
});