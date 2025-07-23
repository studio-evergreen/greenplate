import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import LanguageDropdown from '@/app/components/LanguageDropdown';
import { LanguageProvider } from '@/app/components/LanguageProvider';

// Mock the cookies utility completely
jest.mock('@/lib/utils/cookies', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  getLanguageCookie: jest.fn().mockReturnValue('en'),
  setLanguageCookie: jest.fn(),
}));

// Mock window.matchMedia for responsive behavior
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false, // Default to desktop view
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

function LanguageDropdownWithProvider() {
  return (
    <LanguageProvider>
      <LanguageDropdown />
    </LanguageProvider>
  );
}

describe('LanguageDropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset to desktop view
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders language dropdown button', async () => {
    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
      // Button should show US flag by default (English)
      expect(screen.getByText('🇺🇸')).toBeInTheDocument();
    });
  });

  it('opens and closes dropdown when clicked', async () => {
    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    const button = await waitFor(() => screen.getByRole('button'));

    // Initially dropdown should be closed
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Click to open dropdown
    await act(async () => {
      fireEvent.click(button);
    });

    // Check dropdown is open
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
      // Should show both language options
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('한국어')).toBeInTheDocument();
    });
  });

  it('shows language options when opened', async () => {
    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    const button = await waitFor(() => screen.getByRole('button'));

    // Open dropdown
    await act(async () => {
      fireEvent.click(button);
    });

    // Check for both language options with flags
    await waitFor(() => {
      expect(screen.getAllByText('🇺🇸')).toHaveLength(2); // One in button, one in dropdown
      expect(screen.getByText('🇰🇷')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('한국어')).toBeInTheDocument();
    });
  });

  it('closes dropdown when clicking outside', async () => {
    await act(async () => {
      render(
        <div>
          <LanguageDropdownWithProvider />
          <div data-testid="outside">Outside content</div>
        </div>
      );
    });

    const button = await waitFor(() => screen.getByRole('button'));

    // Open dropdown
    await act(async () => {
      fireEvent.click(button);
    });

    // Verify dropdown is open
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    // Click outside
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('outside'));
    });

    // Verify dropdown is closed
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  it('maintains accessibility attributes', async () => {
    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    const button = await waitFor(() => screen.getByRole('button'));

    // Check initial ARIA attributes
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
    expect(button).toHaveAttribute('aria-expanded', 'false');

    // Open dropdown
    await act(async () => {
      fireEvent.click(button);
    });

    // Check expanded state
    await waitFor(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  it('handles mobile responsive behavior', async () => {
    // Mock mobile viewport
    (window.matchMedia as jest.Mock).mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    // Component should render without errors on mobile
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // Simplified test - just check that component works with different initial language
  it('can be initialized with different languages', async () => {
    // Mock Korean as initial language
    const { getLanguageCookie } = require('@/lib/utils/cookies');
    getLanguageCookie.mockReturnValue('ko');

    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    // Should show Korean flag initially
    await waitFor(() => {
      expect(screen.getByText('🇰🇷')).toBeInTheDocument();
    });
  });

  it('shows both language options when dropdown is open', async () => {
    await act(async () => {
      render(<LanguageDropdownWithProvider />);
    });

    const button = await waitFor(() => screen.getByRole('button'));

    // Open dropdown
    await act(async () => {
      fireEvent.click(button);
    });

    // Both language options should be visible
    await waitFor(() => {
      const languageButtons = screen.getAllByRole('button');
      expect(languageButtons.length).toBeGreaterThan(1); // Main button + language options
      
      // Check for language labels
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('한국어')).toBeInTheDocument();
    });
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<LanguageDropdownWithProvider />);
    }).not.toThrow();
  });
});