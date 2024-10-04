import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CountrySelection from './CountrySelection';
import { getCountries } from '../_services/apiPlace';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

jest.mock('../_services/apiPlace');
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn((key) => {
      if (key === 'country') return 'all';
      return null;
    }),
  })),  
}));

describe('CountrySelection', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/mock-path');
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'country') return 'all';
        return null;
      }),
    });
    (getCountries as jest.Mock).mockResolvedValue([
      { cca2: 'US', name: { common: 'United States' } },
      { cca2: 'CA', name: { common: 'Canada' } },
      { cca2: 'MX', name: { common: 'Mexico' } },
    ]);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('renders the select element with default value', async () => {
    render(<CountrySelection />);

    await waitFor(() => {
      expect(screen.getByRole('option-country')).toHaveValue('all');
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('Canada')).toBeInTheDocument();
    });
  });
});