import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '@/app/components/Toast';

describe('Toast', () => {
  const defaultProps = {
    id: 'test-toast',
    type: 'info' as const,
    title: 'Test Title',
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render toast with title', () => {
    render(<Toast {...defaultProps} />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should render toast with title and message', () => {
    render(<Toast {...defaultProps} message="Test message" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render different toast types with correct icons', () => {
    const { rerender, container } = render(<Toast {...defaultProps} type="success" />);
    expect(container.querySelector('svg')).toBeInTheDocument(); // Success icon

    rerender(<Toast {...defaultProps} type="error" />);
    expect(container.querySelector('svg')).toBeInTheDocument(); // Error icon

    rerender(<Toast {...defaultProps} type="warning" />);
    expect(container.querySelector('svg')).toBeInTheDocument(); // Warning icon

    rerender(<Toast {...defaultProps} type="info" />);
    expect(container.querySelector('svg')).toBeInTheDocument(); // Info icon
  });

  it('should render close button', () => {
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    // Wait for the 300ms timeout
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });

  it('should auto-close after duration when provided', async () => {
    render(<Toast {...defaultProps} duration={3000} />);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    
    // Advance 3000ms for the auto-close, then 300ms for the animation
    await act(async () => {
      jest.advanceTimersByTime(3000 + 300);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });

  it('should auto-close after default duration when duration not provided', async () => {
    render(<Toast {...defaultProps} />);
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
    
    // Advance 5000ms for the auto-close, then 300ms for the animation
    await act(async () => {
      jest.advanceTimersByTime(5000 + 300);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });

  it('should clear timeout when component unmounts', async () => {
    const { unmount } = render(<Toast {...defaultProps} duration={3000} />);
    
    unmount();
    
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it('should be keyboard accessible for close button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    
    // Focus the close button
    closeButton.focus();
    expect(closeButton).toHaveFocus();
    
    // Press Enter
    await user.keyboard('{Enter}');
    
    // Wait for the 300ms timeout
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });

  it('should handle long titles and messages', () => {
    const longTitle = 'This is a very long title that should be displayed properly';
    const longMessage = 'This is a very long message that should be displayed properly in the toast component without breaking the layout or causing any issues.';
    
    render(<Toast {...defaultProps} title={longTitle} message={longMessage} />);
    
    expect(screen.getByText(longTitle)).toBeInTheDocument();
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('should handle empty message gracefully', () => {
    render(<Toast {...defaultProps} message="" />);
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('should have proper styling structure', () => {
    const { container } = render(<Toast {...defaultProps} type="success" />);
    
    const toast = container.firstChild as HTMLElement;
    expect(toast).toHaveClass('p-4', 'rounded-lg', 'shadow-lg', 'border');
  });

  it('should apply correct color scheme for dark mode', () => {
    const { container } = render(<Toast {...defaultProps} type="success" />);
    
    const toast = container.firstChild as HTMLElement;
    expect(toast).toHaveClass('bg-green-50', 'dark:bg-green-900/20');
  });

  it('should handle missing title gracefully', () => {
    render(<Toast {...defaultProps} title="" />);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('should start exit animation when close is triggered', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    // Should call onClose after 300ms animation
    await act(async () => {
      jest.advanceTimersByTime(300);
    });
    
    expect(defaultProps.onClose).toHaveBeenCalledWith('test-toast');
  });
});