// LocationCard.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LocationCard } from './LocationCard'; // Adjust the import based on your file structure
import { useGetOpenWeatherData } from '@/hooks/api/useGetOpenWeatherData';
import type { Location } from '@/stores/useLocationStore';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';

// Mock the useGetOpenWeatherData hook
jest.mock('@/hooks/api/useGetOpenWeatherData');

const mockRefetch = jest.fn();
const mockUseGetOpenWeatherData = useGetOpenWeatherData as jest.Mock;

describe('LocationCard Component', () => {
  const mockLocation: Location = {
    id: '123',
    lat: '12.34',
    lon: '56.78',
    displayPlace: 'Test Place',
    displayAddress: 'Test Address',
  };

  const mockUnit: TemperatureUnit = {
    unit: 'kelvin',
    type: 'standard',
    label: 'Kelvin',
    symbol: 'K',
  };
  const mockOnClick = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    // Reset the mock before each test
    mockUseGetOpenWeatherData.mockReturnValue({
      data: {
        weather: [{ icon: '01d' }],
        main: { temp: 20, feels_like: 22, temp_min: 15, temp_max: 25 },
      },
      refetch: mockRefetch,
      isFetching: false,
    });
  });

  test('renders location information', () => {
    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText(mockLocation.displayPlace)).toBeInTheDocument();
    expect(screen.getByText(mockLocation.displayAddress)).toBeInTheDocument();
  });

  test('renders weather data', () => {
    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    expect(screen.getByText(/Temperature:/)).toHaveTextContent(
      'Temperature: 20 K',
    );
    expect(screen.getByText(/Feels Like:/)).toHaveTextContent(
      'Feels Like: 22 K',
    );
    expect(screen.getByText(/Min:/)).toHaveTextContent('Min: 15 K');
    expect(screen.getByText(/Max:/)).toHaveTextContent('Max: 25 K');
  });

  test('calls refetch function when refresh button is clicked', () => {
    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByTestId('refresh-button'));
    expect(mockRefetch).toHaveBeenCalled();
  });

  test('calls onDelete function when delete button is clicked', () => {
    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByTestId('delete-button'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  test('calls onClick function when card is clicked', () => {
    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    fireEvent.click(screen.getByText(mockLocation.displayPlace));
    expect(mockOnClick).toHaveBeenCalled();
  });

  test('shows loading state when fetching data', async () => {
    mockUseGetOpenWeatherData.mockReturnValueOnce({
      data: null,
      refetch: mockRefetch,
      isFetching: true,
    });

    render(
      <LocationCard
        location={mockLocation}
        unit={mockUnit}
        onClick={mockOnClick}
        onDelete={mockOnDelete}
      />,
    );

    expect(await screen.findByText(/loading/i)).toBeInTheDocument();
  });
});
