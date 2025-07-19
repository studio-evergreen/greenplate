import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/app/components/ToastProvider';

// Test component to access toast context
const TestComponent = () => {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  return (
    <div>
      <button
        data-testid="add-success"
        onClick={() => showSuccess('Success message')}
      >
        Add Success
      </button>
      <button
        data-testid="add-error"
        onClick={() => showError('Error message')}
      >
        Add Error
      </button>
      <button
        data-testid="add-warning"
        onClick={() => showWarning('Warning message')}
      >
        Add Warning
      </button>
      <button
        data-testid="add-info"
        onClick={() => showInfo('Info message')}
      >
        Add Info
      </button>
    </div>
  );
};

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render children and provide toast context', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    expect(screen.getByTestId('add-success')).toBeInTheDocument();
    expect(screen.getByTestId('add-error')).toBeInTheDocument();
    expect(screen.getByTestId('add-warning')).toBeInTheDocument();
    expect(screen.getByTestId('add-info')).toBeInTheDocument();
  });

  it('should display toast when showSuccess is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('add-success').click();
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should display multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('add-success').click();
      screen.getByTestId('add-error').click();
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should display different toast types', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('add-success').click();
      screen.getByTestId('add-error').click();
      screen.getByTestId('add-warning').click();
      screen.getByTestId('add-info').click();
    });

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should throw error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within a ToastProvider');

    console.error = originalError;
  });

  it('should provide all required toast methods', () => {
    let contextValue: any;
    
    const TestContextComponent = () => {
      contextValue = useToast();
      return null;
    };

    render(
      <ToastProvider>
        <TestContextComponent />
      </ToastProvider>
    );

    expect(contextValue).toHaveProperty('showToast');
    expect(contextValue).toHaveProperty('showSuccess');
    expect(contextValue).toHaveProperty('showError');
    expect(contextValue).toHaveProperty('showWarning');
    expect(contextValue).toHaveProperty('showInfo');
  });

  it('should handle showToast with custom config', () => {
    const TestCustomComponent = () => {
      const { showToast } = useToast();
      
      return (
        <button
          data-testid="add-custom"
          onClick={() => showToast({
            type: 'success',
            title: 'Custom Toast',
            message: 'Custom message',
            duration: 3000
          })}
        >
          Add Custom
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestCustomComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('add-custom').click();
    });

    expect(screen.getByText('Custom Toast')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should handle toast methods with optional message parameter', () => {
    const TestMessageComponent = () => {
      const { showSuccess } = useToast();
      
      return (
        <button
          data-testid="add-with-message"
          onClick={() => showSuccess('Title', 'Optional message')}
        >
          Add With Message
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestMessageComponent />
      </ToastProvider>
    );

    act(() => {
      screen.getByTestId('add-with-message').click();
    });

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Optional message')).toBeInTheDocument();
  });
});