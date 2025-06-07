import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/page';
import { useRouter } from 'next/navigation';

// import combobox from '../../components/components/ui/custom/combobox';

// Fix: Mock useRouter safely
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));


// Fix: Mock Combobox with test-triggerable button
// jest.mock('@/components/components/ui/custom/combobox', () => ({
jest.mock('../../components/components/ui/custom/combobox', () => ({
  Combobox: ({ onSelectOption }: any) => (
    <button onClick={() => onSelectOption({ name: 'Bangkok', lat: 13.75, lon: 100.5, country: 'TH' })}>
      Mock Combobox
    </button>
  ),
}));

// Fix: Mock useFetch to return weather data
jest.mock('../app/hook/useFetch', () => () => ({
  data: [
    { name: 'Bangkok', lat: 13.75, lon: 100.5, country: 'TH' },
  ],
  loading: false,
  error: null,
  refetchWithParams: jest.fn(),
}));

describe('Home Page', () => {
  beforeEach(() => {
    // Reset router mock before each test
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
  });

  it('displays empty message initially', () => {
    render(<Home />);
    expect(screen.getByText(/No cities added/i)).toBeInTheDocument();
  });

  it('adds a city when selected', () => {
    render(<Home />);
    fireEvent.click(screen.getByText('Mock Combobox'));
    expect(screen.getByText(/Bangkok, TH/i)).toBeInTheDocument();
  });
});
