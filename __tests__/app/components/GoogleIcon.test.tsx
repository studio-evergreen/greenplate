import { render } from '@testing-library/react';
import GoogleIcon from '@/app/components/GoogleIcon';

describe('GoogleIcon Component', () => {
  it('renders SVG with default size', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders with custom size', () => {
    const { container } = render(<GoogleIcon size={32} />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('applies custom className', () => {
    const { container } = render(<GoogleIcon className="custom-icon-class" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveClass('custom-icon-class');
  });

  it('has correct viewBox for Google logo', () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector('svg');
    
    expect(svg).toHaveAttribute('viewBox', '0 0 48 48');
  });

  it('contains Google brand colors', () => {
    const { container } = render(<GoogleIcon />);
    const paths = container.querySelectorAll('path');
    
    // Check that we have the expected paths (4 for Google logo colors + 1 for clipPath)
    expect(paths.length).toBeGreaterThanOrEqual(4);
    
    // Check for Google brand colors
    const fills = Array.from(paths).map(path => path.getAttribute('fill'));
    expect(fills).toContain('#4285F4'); // Blue
    expect(fills).toContain('#34A853'); // Green
    expect(fills).toContain('#FBBC05'); // Yellow
    expect(fills).toContain('#EA4335'); // Red
  });
});