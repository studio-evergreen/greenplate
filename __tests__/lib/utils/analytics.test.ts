import { trackEvent, trackPageView, setUserId, setUserProperties } from '@/lib/utils/analytics';

// Mock the environment
jest.mock('@/lib/config/env', () => ({
  env: {
    NEXT_PUBLIC_GA_ID: 'G-TEST123',
    NEXT_PUBLIC_GTM_ID: 'GTM-TEST456',
  },
}));

describe('Analytics Utils', () => {
  let mockGtag: jest.Mock;

  beforeEach(() => {
    mockGtag = jest.fn();
    Object.defineProperty(window, 'gtag', {
      value: mockGtag,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete (window as any).gtag;
  });

  describe('trackEvent', () => {
    it('should call gtag with event name and properties', () => {
      trackEvent('button_click', { button_name: 'Login' });
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'button_click', {
        button_name: 'Login',
      });
    });

    it('should work without properties', () => {
      trackEvent('page_view');
      
      expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', undefined);
    });

    it('should not call gtag when gtag is not available', () => {
      const newMockGtag = jest.fn();
      delete (window as any).gtag;
      
      trackEvent('test_event');
      
      expect(newMockGtag).not.toHaveBeenCalled();
    });
  });

  describe('trackPageView', () => {
    it('should call gtag config with page path', () => {
      trackPageView('/test-page');
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        page_path: '/test-page',
      });
    });
  });

  describe('setUserId', () => {
    it('should call gtag config with user ID', () => {
      setUserId('user123');
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        user_id: 'user123',
      });
    });
  });

  describe('setUserProperties', () => {
    it('should call gtag config with custom properties', () => {
      const properties = { subscription_type: 'premium' };
      setUserProperties(properties);
      
      expect(mockGtag).toHaveBeenCalledWith('config', 'G-TEST123', {
        custom_map: properties,
      });
    });
  });
});