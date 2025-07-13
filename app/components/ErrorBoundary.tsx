"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import Button from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
          <div className="max-w-md w-full bg-[var(--card)] rounded-3xl shadow-2xl p-10 border border-[var(--border)] text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                Something went wrong
              </h1>
              <p className="text-[var(--muted)] text-sm">
                We&apos;re sorry, but something unexpected happened. Please try again.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  window.location.href = '/';
                }}
              >
                Go Home
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-[var(--muted)] cursor-pointer hover:text-[var(--foreground)]">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-600 mt-2 p-3 bg-red-50 rounded overflow-auto">
                  {this.state.error.message}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}