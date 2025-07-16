import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/app/components/Button';

describe('Button Component', () => {
  it('renders button with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-emerald-600');
  });

  it('applies secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-[var(--card)]');
  });

  it('applies ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });

  it('applies full width when specified', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">⭐</span>;
    render(
      <Button leftIcon={<LeftIcon />}>
        Button with Left Icon
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">→</span>;
    render(
      <Button rightIcon={<RightIcon />}>
        Button with Right Icon
      </Button>
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  describe('Responsive behavior', () => {
    it('applies responsive size classes for medium size', () => {
      render(<Button size="md">Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-3', 'px-4', 'sm:py-2.5', 'sm:px-4', 'text-base', 'gap-2');
    });

    it('applies responsive size classes for large size', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-4', 'px-6', 'sm:py-3', 'sm:px-5', 'text-lg', 'gap-2');
    });

    it('applies small size classes', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('py-2', 'px-3', 'text-sm', 'gap-1');
    });
  });
});