import { render } from '@testing-library/react';
import { useSearchParams } from 'next/navigation';
import BackButton from './BackButton';

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

describe('BackButton', () => {
  it('renders back href with default query parameters', () => {    
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'unit') return null;
        if (key === 'country') return null;
      }),
    });

    const { getByText } = render(<BackButton />);
    const linkElement = getByText(/< Back/i);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/?unit=celsius&country=all');
  });

  it('renders with specific query parameters', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'unit') return 'fahrenheit';
        if (key === 'country') return 'us';
      }),
    });

    const { getByText } = render(<BackButton />);
    const linkElement = getByText(/< Back/i);

    expect(linkElement).toBeInTheDocument();
    expect(linkElement.closest('a')).toHaveAttribute('href', '/?unit=fahrenheit&country=us');
  });
});