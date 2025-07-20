import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AnalyticsTestPage from '@/app/(main)/analytics-test/page';
import { useToast } from '@/app/components/ToastProvider';
import * as analytics from '@/lib/utils/analytics';

// Mock the analytics utilities
jest.mock('@/lib/utils/analytics');
const mockTrackEvent = jest.mocked(analytics.trackEvent);
const mockTrackPageView = jest.mocked(analytics.trackPageView);
const mockSetUserId = jest.mocked(analytics.setUserId);
const mockSetUserProperties = jest.mocked(analytics.setUserProperties);

// Mock the toast provider
jest.mock('@/app/components/ToastProvider');
const mockShowToast = jest.fn();
const mockUseToast = jest.mocked(useToast);

// Mock the environment configuration
jest.mock('@/lib/config/env', () => ({
  env: {
    NEXT_PUBLIC_GTM_ID: 'GTM-TEST123',
    NEXT_PUBLIC_GA_ID: undefined,
  },
}));

describe('AnalyticsTestPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
      removeToast: jest.fn(),
    });
  });

  it('should render the analytics test page', () => {
    render(<AnalyticsTestPage />);
    
    expect(screen.getByText('Analytics Testing Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Configuration Status')).toBeInTheDocument();
  });

  it('should show configured status when analytics is set up', () => {
    render(<AnalyticsTestPage />);
    
    expect(screen.getByText('Configured')).toBeInTheDocument();
    expect(screen.getByText('GTM-TEST123')).toBeInTheDocument();
  });

  it('should track page view on component mount', () => {
    render(<AnalyticsTestPage />);
    
    expect(mockTrackPageView).toHaveBeenCalledWith('/analytics-test');
  });

  it('should track button click event', async () => {
    render(<AnalyticsTestPage />);
    
    const buttonClickButton = screen.getByText('Test Button Click');
    fireEvent.click(buttonClickButton);
    
    expect(mockTrackEvent).toHaveBeenCalledWith('button_click', {
      button_name: 'Test Button',
      button_type: 'primary',
      page_path: '/analytics-test'
    });
    
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'success',
      title: 'Button Click Tracked',
      message: 'Event sent to Analytics'
    });
  });

  it('should track page view event', async () => {
    render(<AnalyticsTestPage />);
    
    const pageViewButton = screen.getByText('Test Page View');
    fireEvent.click(pageViewButton);
    
    expect(mockTrackPageView).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'Page View Tracked'
      })
    );
  });

  it('should track purchase event', async () => {
    render(<AnalyticsTestPage />);
    
    const purchaseButton = screen.getByText('Test Purchase');
    fireEvent.click(purchaseButton);
    
    expect(mockTrackEvent).toHaveBeenCalledWith('purchase', 
      expect.objectContaining({
        event_category: 'ecommerce',
        value: 29.99,
        currency: 'USD'
      })
    );
  });

  it('should track add to cart event', async () => {
    render(<AnalyticsTestPage />);
    
    const addToCartButton = screen.getByText('Test Add to Cart');
    fireEvent.click(addToCartButton);
    
    expect(mockTrackEvent).toHaveBeenCalledWith('add_to_cart',
      expect.objectContaining({
        event_category: 'ecommerce',
        value: 19.99,
        currency: 'USD'
      })
    );
  });

  it('should set user ID', async () => {
    render(<AnalyticsTestPage />);
    
    const setUserIdButton = screen.getByText('Set User ID');
    fireEvent.click(setUserIdButton);
    
    expect(mockSetUserId).toHaveBeenCalled();
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'success',
        title: 'User ID Set'
      })
    );
  });

  it('should set user properties', async () => {
    render(<AnalyticsTestPage />);
    
    const setUserPropsButton = screen.getByText('Set User Props');
    fireEvent.click(setUserPropsButton);
    
    expect(mockSetUserProperties).toHaveBeenCalledWith({
      subscription_type: 'premium',
      signup_date: expect.any(String),
      user_role: 'admin',
      preferred_language: 'en'
    });
  });

  it('should track search event', async () => {
    render(<AnalyticsTestPage />);
    
    const searchButton = screen.getByText('Test Search');
    fireEvent.click(searchButton);
    
    expect(mockTrackEvent).toHaveBeenCalledWith('search', {
      event_category: 'engagement',
      search_term: 'analytics testing',
      event_label: 'site_search'
    });
  });

  it('should track login event', async () => {
    render(<AnalyticsTestPage />);
    
    const loginButton = screen.getByText('Test Login');
    fireEvent.click(loginButton);
    
    expect(mockTrackEvent).toHaveBeenCalledWith('login', {
      event_category: 'auth',
      method: 'email',
      success: true
    });
  });

  it('should display event logs', async () => {
    render(<AnalyticsTestPage />);
    
    const buttonClickButton = screen.getByText('Test Button Click');
    fireEvent.click(buttonClickButton);
    
    // Should show event log section
    await waitFor(() => {
      expect(screen.getByText('Event Logs')).toBeInTheDocument();
      expect(screen.getByText('button_click')).toBeInTheDocument();
    });
  });

  it('should clear event logs', async () => {
    render(<AnalyticsTestPage />);
    
    // First create some logs
    const buttonClickButton = screen.getByText('Test Button Click');
    fireEvent.click(buttonClickButton);
    
    await waitFor(() => {
      expect(screen.getByText('Event Logs')).toBeInTheDocument();
    });
    
    // Then clear them
    const clearButton = screen.getByText('Clear Logs');
    fireEvent.click(clearButton);
    
    expect(mockShowToast).toHaveBeenCalledWith({
      type: 'info',
      title: 'Event Logs Cleared',
      message: 'All event logs have been cleared'
    });
  });
});