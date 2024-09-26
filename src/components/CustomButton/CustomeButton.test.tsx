import { render, screen, fireEvent } from '@testing-library/react';
import { CustomButton } from '@/components/CustomButton';

// Mock Icon component
const MockIcon = () => <svg data-testid='mock-icon' />;

describe('CustomButton Component', () => {
  const defaultProps = {
    label: 'Click Me',
    title: 'Custom Button',
    onClick: jest.fn(),
    className: 'test-class',
  };

  it('renders the button with label and title', () => {
    render(<CustomButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /click me/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('title', 'Custom Button');
    expect(button).toHaveClass('test-class');
  });

  it('calls onClick handler when clicked', () => {
    render(<CustomButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);

    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('renders the icon if provided', () => {
    render(<CustomButton {...defaultProps} icon={MockIcon} />);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it("doesn't render the icon if not provided", () => {
    render(<CustomButton {...defaultProps} />);

    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });
});
