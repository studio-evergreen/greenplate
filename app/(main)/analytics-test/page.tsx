"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../../components/Card";
import Button from "../../components/Button";
import { Badge } from "../../components/Badge";
import { useToast } from "../../components/ToastProvider";
import { env } from "@/lib/config/env";
import { trackEvent, trackPageView, setUserId, setUserProperties } from "@/lib/utils/analytics";
import { 
  BarChart3, TrendingUp, MousePointer, Eye, Activity,
  CheckCircle, XCircle, AlertCircle, Settings,
  User, ShoppingCart, Heart, Share2, Search, Play,
  LogIn, UserPlus
} from "lucide-react";

// Check if Analytics is configured
const isAnalyticsConfigured = () => {
  const gtmId = env.NEXT_PUBLIC_GTM_ID;
  const gaId = env.NEXT_PUBLIC_GA_ID;
  return Boolean((gtmId && gtmId !== '') || (gaId && gaId !== ''));
};

// Get current Analytics configuration
const getAnalyticsConfig = () => {
  return {
    gtmId: env.NEXT_PUBLIC_GTM_ID || 'Not configured',
    gaId: env.NEXT_PUBLIC_GA_ID || 'Not configured',
    hasGTM: Boolean(env.NEXT_PUBLIC_GTM_ID),
    hasGA: Boolean(env.NEXT_PUBLIC_GA_ID),
    environment: process.env.NODE_ENV,
  };
};

interface EventLog {
  eventName: string;
  properties: Record<string, unknown> | undefined;
  timestamp: Date;
  status: 'success' | 'error';
}

export default function AnalyticsTestPage() {
  const { showToast } = useToast();
  const [isConfigured, setIsConfigured] = useState(false);
  const [config, setConfig] = useState<{
    gtmId: string;
    gaId: string;
    hasGTM: boolean;
    hasGA: boolean;
    environment: string;
  } | null>(null);
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    const configured = isAnalyticsConfigured();
    setIsConfigured(configured);
    setConfig(getAnalyticsConfig());
    
    // Track page view for this test page
    if (configured) {
      trackPageView('/analytics-test');
      addEventLog('page_view', { page_path: '/analytics-test' }, 'success');
    }
  }, []);

  const addEventLog = (eventName: string, properties: Record<string, unknown> | undefined, status: 'success' | 'error') => {
    setEventLogs(prev => [...prev, {
      eventName,
      properties,
      timestamp: new Date(),
      status
    }]);
  };

  // Basic tracking tests
  const testButtonClick = () => {
    try {
      trackEvent('button_click', {
        button_name: 'Test Button',
        button_type: 'primary',
        page_path: '/analytics-test'
      });
      addEventLog('button_click', { button_name: 'Test Button' }, 'success');
      showToast({
        type: 'success',
        title: 'Button Click Tracked',
        message: 'Event sent to Analytics'
      });
    } catch {
      addEventLog('button_click', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send event'
      });
    }
  };

  const testPageView = () => {
    try {
      const testPath = `/test-page-${Date.now()}`;
      trackPageView(testPath);
      addEventLog('page_view', { page_path: testPath }, 'success');
      showToast({
        type: 'success',
        title: 'Page View Tracked',
        message: `Page view for ${testPath} sent to Analytics`
      });
    } catch {
      addEventLog('page_view', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send page view'
      });
    }
  };

  // E-commerce events
  const testPurchase = () => {
    try {
      trackEvent('purchase', {
        event_category: 'ecommerce',
        transaction_id: `txn_${Date.now()}`,
        value: 29.99,
        currency: 'USD',
        items: [
          {
            item_id: 'premium_plan',
            item_name: 'Premium Plan',
            category: 'subscription',
            quantity: 1,
            price: 29.99
          }
        ]
      });
      addEventLog('purchase', { value: 29.99, currency: 'USD' }, 'success');
      showToast({
        type: 'success',
        title: 'Purchase Tracked',
        message: 'E-commerce event sent to Analytics'
      });
    } catch {
      addEventLog('purchase', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send purchase event'
      });
    }
  };

  const testAddToCart = () => {
    try {
      trackEvent('add_to_cart', {
        event_category: 'ecommerce',
        currency: 'USD',
        value: 19.99,
        items: [
          {
            item_id: 'basic_plan',
            item_name: 'Basic Plan',
            category: 'subscription',
            quantity: 1,
            price: 19.99
          }
        ]
      });
      addEventLog('add_to_cart', { value: 19.99 }, 'success');
      showToast({
        type: 'success',
        title: 'Add to Cart Tracked',
        message: 'Cart event sent to Analytics'
      });
    } catch {
      addEventLog('add_to_cart', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send cart event'
      });
    }
  };

  // User engagement events
  const testSearch = () => {
    try {
      trackEvent('search', {
        event_category: 'engagement',
        search_term: 'analytics testing',
        event_label: 'site_search'
      });
      addEventLog('search', { search_term: 'analytics testing' }, 'success');
      showToast({
        type: 'success',
        title: 'Search Tracked',
        message: 'Search event sent to Analytics'
      });
    } catch {
      addEventLog('search', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send search event'
      });
    }
  };

  const testShare = () => {
    try {
      trackEvent('share', {
        event_category: 'engagement',
        method: 'social_media',
        content_type: 'article',
        content_id: 'analytics-guide'
      });
      addEventLog('share', { method: 'social_media' }, 'success');
      showToast({
        type: 'success',
        title: 'Share Tracked',
        message: 'Share event sent to Analytics'
      });
    } catch {
      addEventLog('share', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send share event'
      });
    }
  };

  const testVideoPlay = () => {
    try {
      trackEvent('video_play', {
        event_category: 'engagement',
        video_title: 'Analytics Setup Tutorial',
        video_duration: 300,
        video_current_time: 0
      });
      addEventLog('video_play', { video_title: 'Analytics Setup Tutorial' }, 'success');
      showToast({
        type: 'success',
        title: 'Video Play Tracked',
        message: 'Video event sent to Analytics'
      });
    } catch {
      addEventLog('video_play', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send video event'
      });
    }
  };

  // User context tests
  const testSetUserId = () => {
    try {
      const userId = `user_${Date.now()}`;
      setUserId(userId);
      setCurrentUserId(userId);
      addEventLog('set_user_id', { user_id: userId }, 'success');
      showToast({
        type: 'success',
        title: 'User ID Set',
        message: `User ID ${userId} set in Analytics`
      });
    } catch {
      addEventLog('set_user_id', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Failed to Set User ID',
        message: 'Error setting user ID'
      });
    }
  };

  const testSetUserProperties = () => {
    try {
      const properties = {
        subscription_type: 'premium',
        signup_date: new Date().toISOString().split('T')[0],
        user_role: 'admin',
        preferred_language: 'en'
      };
      setUserProperties(properties);
      addEventLog('set_user_properties', properties, 'success');
      showToast({
        type: 'success',
        title: 'User Properties Set',
        message: 'User properties updated in Analytics'
      });
    } catch {
      addEventLog('set_user_properties', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Failed to Set Properties',
        message: 'Error setting user properties'
      });
    }
  };

  // Auth events
  const testLogin = () => {
    try {
      trackEvent('login', {
        event_category: 'auth',
        method: 'email',
        success: true
      });
      addEventLog('login', { method: 'email' }, 'success');
      showToast({
        type: 'success',
        title: 'Login Tracked',
        message: 'Login event sent to Analytics'
      });
    } catch {
      addEventLog('login', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send login event'
      });
    }
  };

  const testSignup = () => {
    try {
      trackEvent('sign_up', {
        event_category: 'auth',
        method: 'email',
        plan_type: 'free'
      });
      addEventLog('sign_up', { method: 'email' }, 'success');
      showToast({
        type: 'success',
        title: 'Signup Tracked',
        message: 'Signup event sent to Analytics'
      });
    } catch {
      addEventLog('sign_up', undefined, 'error');
      showToast({
        type: 'error',
        title: 'Tracking Failed',
        message: 'Failed to send signup event'
      });
    }
  };

  const clearEventLogs = () => {
    setEventLogs([]);
    showToast({
      type: 'info',
      title: 'Event Logs Cleared',
      message: 'All event logs have been cleared'
    });
  };

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' 
      ? <CheckCircle className="w-4 h-4 text-green-500" />
      : <XCircle className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-[var(--foreground)]">
            Analytics Testing Dashboard
          </h1>
        </div>
        <p className="text-lg text-[var(--muted)] max-w-3xl">
          Test and validate your Google Analytics and Tag Manager configuration. 
          This page helps you verify that events and user data are properly sent to your analytics platform.
        </p>
      </div>

      {/* Configuration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
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
                <span className="text-[var(--muted)]">GTM Enabled:</span>
                <Badge variant={config?.hasGTM ? "success" : "secondary"}>
                  {config?.hasGTM ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">GA Enabled:</span>
                <Badge variant={config?.hasGA ? "success" : "secondary"}>
                  {config?.hasGA ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              <h2 className="text-xl font-semibold">Analytics IDs</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              <div>
                <span className="text-[var(--muted)] text-sm">Google Tag Manager ID:</span>
                <div className="font-mono text-xs p-2 bg-[var(--muted)]/10 rounded mt-1 break-all">
                  {config?.gtmId || 'Not configured'}
                </div>
              </div>
              <div>
                <span className="text-[var(--muted)] text-sm">Google Analytics ID:</span>
                <div className="font-mono text-xs p-2 bg-[var(--muted)]/10 rounded mt-1 break-all">
                  {config?.gaId || 'Not configured'}
                </div>
              </div>
              {currentUserId && (
                <div>
                  <span className="text-[var(--muted)] text-sm">Current User ID:</span>
                  <div className="font-mono text-xs p-2 bg-[var(--muted)]/10 rounded mt-1 break-all">
                    {currentUserId}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Test Actions */}
      {isConfigured ? (
        <div className="space-y-6 mb-8">
          {/* Basic Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Basic Events</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-[var(--muted)] mb-6">
                Test basic interaction events like clicks and page views.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  leftIcon={<MousePointer size={16} />}
                  onClick={testButtonClick}
                  fullWidth
                >
                  Test Button Click
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Eye size={16} />}
                  onClick={testPageView}
                  fullWidth
                >
                  Test Page View
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Search size={16} />}
                  onClick={testSearch}
                  fullWidth
                >
                  Test Search
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* E-commerce Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">E-commerce Events</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-[var(--muted)] mb-6">
                Test e-commerce related events for tracking purchases and cart interactions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="primary"
                  className="bg-green-600 hover:bg-green-700"
                  leftIcon={<ShoppingCart size={16} />}
                  onClick={testAddToCart}
                  fullWidth
                >
                  Test Add to Cart
                </Button>
                <Button
                  variant="primary"
                  className="bg-purple-600 hover:bg-purple-700"
                  leftIcon={<TrendingUp size={16} />}
                  onClick={testPurchase}
                  fullWidth
                >
                  Test Purchase
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Engagement Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold">Engagement Events</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-[var(--muted)] mb-6">
                Test user engagement events like sharing, video plays, and interactions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  className="bg-orange-600 hover:bg-orange-700"
                  leftIcon={<Share2 size={16} />}
                  onClick={testShare}
                  fullWidth
                >
                  Test Share
                </Button>
                <Button
                  variant="primary"
                  className="bg-red-600 hover:bg-red-700"
                  leftIcon={<Play size={16} />}
                  onClick={testVideoPlay}
                  fullWidth
                >
                  Test Video Play
                </Button>
                <Button
                  variant="primary"
                  className="bg-pink-600 hover:bg-pink-700"
                  leftIcon={<Heart size={16} />}
                  onClick={() => trackEvent('like', { content_type: 'post' })}
                  fullWidth
                >
                  Test Like
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* User & Auth Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold">User & Auth Events</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-[var(--muted)] mb-6">
                Test user identification and authentication events.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="primary"
                  className="bg-blue-600 hover:bg-blue-700"
                  leftIcon={<User size={16} />}
                  onClick={testSetUserId}
                  fullWidth
                >
                  Set User ID
                </Button>
                <Button
                  variant="primary"
                  className="bg-indigo-600 hover:bg-indigo-700"
                  leftIcon={<Settings size={16} />}
                  onClick={testSetUserProperties}
                  fullWidth
                >
                  Set User Props
                </Button>
                <Button
                  variant="primary"
                  className="bg-cyan-600 hover:bg-cyan-700"
                  leftIcon={<LogIn size={16} />}
                  onClick={testLogin}
                  fullWidth
                >
                  Test Login
                </Button>
                <Button
                  variant="primary"
                  className="bg-teal-600 hover:bg-teal-700"
                  leftIcon={<UserPlus size={16} />}
                  onClick={testSignup}
                  fullWidth
                >
                  Test Signup
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Analytics Setup Required</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-[var(--muted)]">
                Analytics tracking is not configured. To enable analytics testing, you need to set up either Google Tag Manager or Google Analytics:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Google Tag Manager Setup:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--muted)]">
                    <li>Create a Google Tag Manager account</li>
                    <li>Create a new container for your website</li>
                    <li>Copy your Container ID (GTM-XXXXXXX)</li>
                    <li>Add to your <code className="bg-[var(--muted)]/20 px-1 rounded">.env.local</code>:</li>
                  </ol>
                  <div className="bg-[var(--muted)]/10 p-3 rounded-lg font-mono text-xs mt-2">
                    NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Google Analytics Setup:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--muted)]">
                    <li>Create a Google Analytics 4 property</li>
                    <li>Set up a data stream for your website</li>
                    <li>Copy your Measurement ID (G-XXXXXXXXXX)</li>
                    <li>Add to your <code className="bg-[var(--muted)]/20 px-1 rounded">.env.local</code>:</li>
                  </ol>
                  <div className="bg-[var(--muted)]/10 p-3 rounded-lg font-mono text-xs mt-2">
                    NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Event Logs */}
      {eventLogs.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold">Event Logs</h2>
                <Badge variant="info" size="sm">
                  {eventLogs.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearEventLogs}
              >
                Clear Logs
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {eventLogs.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-[var(--muted)]/5 rounded-lg"
                >
                  {getStatusIcon(log.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.eventName}</span>
                      <Badge 
                        variant={log.status === 'success' ? 'success' : 'danger'}
                        size="sm"
                      >
                        {log.status}
                      </Badge>
                    </div>
                    {log.properties && (
                      <div className="text-xs text-[var(--muted)] font-mono bg-[var(--muted)]/10 p-2 rounded mt-2">
                        {JSON.stringify(log.properties, null, 2)}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-[var(--muted)] whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}