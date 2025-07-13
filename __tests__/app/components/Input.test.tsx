import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '@/app/components/Input';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" placeholder="Enter email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('displays error message', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when no error', () => {
    render(<Input helperText="This is helper text" />);
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('prioritizes error over helper text', () => {
    render(
      <Input 
        error="Error message" 
        helperText="Helper text" 
      />
    );
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('applies full width class', () => {
    render(<Input fullWidth placeholder="Full width input" />);
    const container = screen.getByPlaceholderText('Full width input').closest('div');
    expect(container).toHaveClass('w-full');
  });

  it('renders with left icon', () => {
    const LeftIcon = () => <span data-testid="left-icon">@</span>;
    render(<Input leftIcon={<LeftIcon />} placeholder="With left icon" />);
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    const RightIcon = () => <span data-testid="right-icon">👁</span>;
    render(<Input rightIcon={<RightIcon />} placeholder="With right icon" />);
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    
    const input = screen.getByPlaceholderText('Type here');
    await user.type(input, 'Hello World');
    
    expect(input).toHaveValue('Hello World');
  });

  it('sets aria-invalid when error is present', () => {
    render(<Input error="Invalid input" placeholder="Invalid field" />);
    const input = screen.getByPlaceholderText('Invalid field');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not set aria-invalid when no error', () => {
    render(<Input placeholder="Valid field" />);
    const input = screen.getByPlaceholderText('Valid field');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('connects error message with aria-describedby', () => {
    render(<Input error="Error message" placeholder="Field with error" />);
    const input = screen.getByPlaceholderText('Field with error');
    const errorMessage = screen.getByText('Error message');
    
    expect(input).toHaveAttribute('aria-describedby');
    expect(errorMessage).toHaveAttribute('id', input.getAttribute('aria-describedby'));
  });

  it('applies disabled styles when disabled', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-60', 'cursor-not-allowed');
  });
});