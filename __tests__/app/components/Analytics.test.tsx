import { render } from '@testing-library/react';
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

// Get access to the mocked env
const mockEnvModule = require('@/lib/config/env');

describe('Analytics Component', () => {
  beforeEach(() => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = undefined;
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = undefined;
  });

  it('should render nothing when no analytics IDs are provided', () => {
    const { container } = render(<Analytics />);
    expect(container.firstChild).toBeNull();
  });

  it('should render GTM script when GTM ID is provided', () => {
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST456';
    
    const { getByTestId } = render(<Analytics />);
    
    expect(getByTestId('gtm-init')).toBeInTheDocument();
  });

  it('should render GA script when only GA ID is provided', () => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    
    const { getByTestId } = render(<Analytics />);
    
    expect(getByTestId('ga-init')).toBeInTheDocument();
  });

  it('should prioritize GTM over GA when both are provided', () => {
    mockEnvModule.env.NEXT_PUBLIC_GA_ID = 'G-TEST123';
    mockEnvModule.env.NEXT_PUBLIC_GTM_ID = 'GTM-TEST456';
    
    const { getByTestId, queryByTestId } = render(<Analytics />);
    
    expect(getByTestId('gtm-init')).toBeInTheDocument();
    expect(queryByTestId('ga-init')).not.toBeInTheDocument();
  });
});