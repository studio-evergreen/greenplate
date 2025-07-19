"use client";

import { useState, useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Card, CardHeader, CardBody } from "../../components/Card";
import Button from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/ToastProvider";
import { 
  Shield, ShieldCheck, ShieldX, AlertTriangle, 
  Bug, Zap, Server, Eye, Activity,
  CheckCircle, XCircle, AlertCircle, Info
} from "lucide-react";

// Check if Sentry is configured
const isSentryConfigured = () => {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  return Boolean(dsn && dsn !== '' && !dsn.includes('your-actual-dsn'));
};

// Get current Sentry configuration
const getSentryConfig = () => {
  return {
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || 'Not configured',
    enabled: process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true',
    environment: process.env.NODE_ENV,
  };
};

export default function SentryTestPage() {
  const { showToast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<{
    dsn: string;
    enabled: boolean;
    environment: string;
  } | null>(null);
  const [testResults, setTestResults] = useState<{
    type: string;
    status: 'pending' | 'success' | 'error';
    message: string;
    timestamp: Date;
  }[]>([]);

  useEffect(() => {
    const configured = isSentryConfigured();
    setIsConfigured(configured);
    setConfig(getSentryConfig());
  }, []);

  const addTestResult = (type: string, status: 'success' | 'error', message: string) => {
    setTestResults(prev => [...prev, {
      type,
      status,
      message,
      timestamp: new Date()
    }]);
  };

  const testSentryError = async () => {
    try {
      showToast({
        type: 'info',
        title: 'Testing Sentry Error Capture',
        message: 'Throwing a test error...'
      });

      // Throw a test error
      throw new Error('This is a test error for Sentry monitoring');
    } catch (error) {
      // Manually capture the error with additional context
      Sentry.captureException(error, {
        tags: {
          component: 'SentryTestPage',
          test_type: 'manual_error_test'
        },
        extra: {
          user_action: 'clicked_test_error_button',
          timestamp: new Date().toISOString()
        },
        level: 'error'
      });

      addTestResult('Error Capture', 'success', 'Test error sent to Sentry');
      
      showToast({
        type: 'success',
        title: 'Error Sent to Sentry',
        message: 'Check your Sentry dashboard for the test error'
      });
    }
  };

  const testSentryMessage = () => {
    try {
      // Send a custom message
      Sentry.captureMessage('Sentry test message from GreenPlate', {
        level: 'info',
        tags: {
          component: 'SentryTestPage',
          test_type: 'custom_message'
        },
        extra: {
          user_action: 'clicked_test_message_button',
          timestamp: new Date().toISOString(),
          browser: navigator.userAgent
        }
      });

      addTestResult('Message Capture', 'success', 'Test message sent to Sentry');
      
      showToast({
        type: 'success',
        title: 'Message Sent to Sentry',
        message: 'Check your Sentry dashboard for the test message'
      });
    } catch (error) {
      console.error('Message test error:', error);
      addTestResult('Message Capture', 'error', 'Failed to send message to Sentry');
      
      showToast({
        type: 'error',
        title: 'Failed to Send Message',
        message: 'Error sending message to Sentry'
      });
    }
  };

  const testSentryPerformance = () => {
    try {
      // Use the newer Sentry.startSpan API
      Sentry.startSpan(
        {
          name: 'sentry-test-transaction',
          op: 'test'
        },
        () => {
          // Simulate some work with nested spans
          return Sentry.startSpan(
            {
              name: 'test-operation-1',
              op: 'db.query'
            },
            () => {
              // Simulate database work
              return new Promise(resolve => {
                setTimeout(() => {
                  Sentry.startSpan(
                    {
                      name: 'test-operation-2', 
                      op: 'http.client'
                    },
                    () => {
                      // Simulate API call
                      setTimeout(() => {
                        resolve(true);
                        
                        addTestResult('Performance Monitoring', 'success', 'Performance transaction sent to Sentry');
                        
                        showToast({
                          type: 'success',
                          title: 'Performance Data Sent',
                          message: 'Check your Sentry performance monitoring dashboard'
                        });
                      }, 100);
                    }
                  );
                }, 200);
              });
            }
          );
        }
      );

    } catch (error) {
      console.error('Performance test error:', error);
      addTestResult('Performance Monitoring', 'error', 'Failed to send performance data');
      
      showToast({
        type: 'error',
        title: 'Performance Test Failed',
        message: 'Error sending performance data to Sentry'
      });
    }
  };

  const testSentryUser = () => {
    try {
      // Set user context
      Sentry.setUser({
        id: 'test-user-123',
        email: 'test@greenplate.dev',
        username: 'test-user',
        extra: {
          plan: 'premium',
          signup_date: '2024-01-01'
        }
      });

      // Send a message with user context
      Sentry.captureMessage('Test message with user context', {
        level: 'info',
        tags: {
          component: 'SentryTestPage',
          test_type: 'user_context_test'
        }
      });

      addTestResult('User Context', 'success', 'User context set and message sent');
      
      showToast({
        type: 'success',
        title: 'User Context Set',
        message: 'User information attached to Sentry events'
      });
    } catch (error) {
      console.error('User context test error:', error);
      addTestResult('User Context', 'error', 'Failed to set user context');
      
      showToast({
        type: 'error',
        title: 'User Context Failed',
        message: 'Error setting user context in Sentry'
      });
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
    showToast({
      type: 'info',
      title: 'Test Results Cleared',
      message: 'All test results have been cleared'
    });
  };

  const getStatusIcon = (status: 'pending' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
          <h1 className="text-4xl font-bold text-[var(--foreground)]">
            Sentry Testing Dashboard
          </h1>
        </div>
        <p className="text-lg text-[var(--muted)] max-w-3xl">
          Test and validate your Sentry error monitoring configuration. 
          This page helps you verify that errors, messages, and performance data are properly sent to Sentry.
        </p>
      </div>

      {/* Configuration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <ShieldCheck className="w-5 h-5 text-green-500" />
              ) : (
                <ShieldX className="w-5 h-5 text-red-500" />
              )}
              <h2 className="text-xl font-semibold">Configuration Status</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Status:</span>
                <Badge variant={isConfigured ? "success" : "danger"}>
                  {isConfigured ? "Configured" : "Not Configured"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Environment:</span>
                <Badge variant="info">{config?.environment || 'unknown'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Enabled:</span>
                <Badge variant={config?.enabled ? "success" : "secondary"}>
                  {config?.enabled ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">DSN Configuration</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <span className="text-[var(--muted)] text-sm">Client DSN:</span>
                <div className="font-mono text-xs p-2 bg-[var(--muted)]/10 rounded mt-1 break-all">
                  {config?.dsn || 'Not configured'}
                </div>
              </div>
              {!isConfigured && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Setup Required</p>
                      <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                        Please configure your Sentry DSN in the environment variables to enable monitoring.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Test Actions */}
      {isConfigured ? (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bug className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-semibold">Sentry Tests</h2>
            </div>
          </CardHeader>
          <CardBody>
            <p className="text-[var(--muted)] mb-6">
              Click the buttons below to test different Sentry features. Check your Sentry dashboard to verify the data is received.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                leftIcon={<AlertCircle size={16} />}
                onClick={testSentryError}
                fullWidth
              >
                Test Error
              </Button>
              <Button
                variant="primary" 
                className="bg-blue-600 hover:bg-blue-700"
                leftIcon={<Info size={16} />}
                onClick={testSentryMessage}
                fullWidth
              >
                Test Message
              </Button>
              <Button
                variant="primary"
                className="bg-green-600 hover:bg-green-700"
                leftIcon={<Zap size={16} />}
                onClick={testSentryPerformance}
                fullWidth
              >
                Test Performance
              </Button>
              <Button
                variant="primary"
                className="bg-purple-600 hover:bg-purple-700"
                leftIcon={<Eye size={16} />}
                onClick={testSentryUser}
                fullWidth
              >
                Test User Context
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Sentry Setup Required</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-[var(--muted)]">
                Sentry monitoring is not configured. To enable Sentry testing, you need to:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[var(--muted)]">
                <li>Create a Sentry account at <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">sentry.io</a></li>
                <li>Create a new Next.js project in your Sentry dashboard</li>
                <li>Copy your DSN from the project settings</li>
                <li>Update your <code className="bg-[var(--muted)]/20 px-1 rounded">.env.local</code> file with:</li>
              </ol>
              <div className="bg-[var(--muted)]/10 p-4 rounded-lg font-mono text-sm">
                <div className="text-green-600 dark:text-green-400"># Uncomment and set your actual Sentry DSN</div>
                <div>SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/your-project-id</div>
                <div>NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@your-org.ingest.sentry.io/your-project-id</div>
                <div>SENTRY_ORG=your-org-name</div>
                <div>SENTRY_PROJECT=your-project-name</div>
                <div className="text-blue-600 dark:text-blue-400"># Optional: enable in development</div>
                <div>NEXT_PUBLIC_SENTRY_ENABLED=true</div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">Test Results</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearTestResults}
              >
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[var(--muted)]/5 rounded-lg"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{result.type}</span>
                      <Badge 
                        variant={result.status === 'success' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--muted)] mt-1">
                      {result.message}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--muted)]">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Setup Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold">Setup Instructions</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Current Configuration Status:</h3>
              <ul className="space-y-1 text-sm text-[var(--muted)]">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Sentry package installed (@sentry/nextjs)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Configuration files present
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Next.js integration configured
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Error boundary set up
                </li>
                <li className="flex items-center gap-2">
                  {isConfigured ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  Environment variables configured
                </li>
              </ul>
            </div>
            
            {!isConfigured && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Next Steps:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Sign up for a free Sentry account</li>
                  <li>Create a new Next.js project</li>
                  <li>Copy your project DSN</li>
                  <li>Update your environment variables</li>
                  <li>Restart your development server</li>
                  <li>Return to this page to test the integration</li>
                </ol>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}