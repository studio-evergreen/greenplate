import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '@/app/components/ThemeToggle';
import { ThemeProvider } from '@/app/components/ThemeProvider';

// Mock cookies
jest.mock('@/lib/utils/cookies', () => ({
  getCookie: jest.fn().mockReturnValue('light'),
  setCookie: jest.fn(),
}));

// Mock the theme context
const mockSetTheme = jest.fn();

jest.mock('@/app/components/ThemeProvider', () => ({
  ...jest.requireActual('@/app/components/ThemeProvider'),
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render theme toggle button', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Theme toggle');
  });

  it('should call setTheme when clicked', async () => {
    const user = userEvent.setup();
    
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalled();
  });

  it('should render with proper styling classes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('p-2', 'rounded');
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    
    // Focus the button
    button.focus();
    expect(button).toHaveFocus();
    
    // Activate with Enter
    await user.keyboard('{Enter}');
    expect(mockSetTheme).toHaveBeenCalled();
    
    // Clear mock for space test
    mockSetTheme.mockClear();
    
    // Activate with Space
    await user.keyboard(' ');
    expect(mockSetTheme).toHaveBeenCalled();
  });

  it('should have proper ARIA attributes', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Theme toggle');
  });
});