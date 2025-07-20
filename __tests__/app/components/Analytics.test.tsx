import { render, waitFor, act } from '@testing-library/react';
import Analytics from '@/app/components/Analytics';

// Mock Next.js Script component
jest.mock('next/script', () => {
  return function MockScript({ children, id, ...props }: any) {
    return (
      <script data-testid={id || 'script'} {...props}>
        {children}
      </script>
    );
  };
});

// Mock the environment
jest.mock('@/lib/config/env', () => ({
  env: {
    NEXT_PUBLIC_GA_ID: undefined,
    NEXT_PUBLIC_GTM_ID: undefined,
  },
}));

// Mock consent manager
jest.mock('@/lib/utils/consent-manager', () => ({
  isAnalyticsAllowed: jest.fn(),
}));

// Get access to the mocked env and consent manager
const mockEnvModule = require('@/lib/config/env');
const { isAnalyticsAllowed } = require('@/lib/utils/consent-manager');

describe('Analytics Component', () => {
  beforeEach(() => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = undefined;
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = undefined;
    (isAnalyticsAllowed as jest.Mock).mockReset();
  });

  it('should render nothing when no analytics IDs are provided', async () => {
    (isAnalyticsAllowed as jest.Mock).mockResolvedValue(true);
    
    const { container } = render(<Analytics />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('should render nothing when consent is not given', async () => {
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST456';
    (isAnalyticsAllowed as jest.Mock).mockResolvedValue(false);
    
    const { container } = render(<Analytics />);
    
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it('should render GTM script when GTM ID is provided and consent given', async () => {
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST456';
    (isAnalyticsAllowed as jest.Mock).mockResolvedValue(true);
    
    const { getByTestId } = render(<Analytics />);
    
    await waitFor(() => {
      expect(getByTestId('gtm-head')).toBeInTheDocument();
    });
  });

  it('should render GA script when only GA ID is provided and consent given', async () => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    (isAnalyticsAllowed as jest.Mock).mockResolvedValue(true);
    
    const { getByTestId } = render(<Analytics />);
    
    await waitFor(() => {
      expect(getByTestId('ga-init')).toBeInTheDocument();
    });
  });

  it('should render both GTM and GA scripts when both are provided and consent given', async () => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST456';
    (isAnalyticsAllowed as jest.Mock).mockResolvedValue(true);
    
    const { getByTestId } = render(<Analytics />);
    
    await waitFor(() => {
      expect(getByTestId('gtm-head')).toBeInTheDocument();
      expect(getByTestId('ga-gtm-init')).toBeInTheDocument();
    });
  });
});