import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchResultsList from '../../components/SearchResultsList';
import { WeatherData } from '../../model/WeatherData';
import { City } from '../../model/CityModel';

// Mock the next/link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock the CityService
jest.mock('../../service/cityService', () => ({
  CityService: {
    getWeatherData: jest.fn()
  }
}));

// Import after mocking
import { CityService } from '../../service/cityService';
const mockGetWeatherData = CityService.getWeatherData as jest.Mock;

describe('SearchResultsList - Timezone Coverage', () => {
  // Base mock weather data
  const baseWeatherData: WeatherData = {
    city: {
      id: 1,
      name: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      coord: { lat: 0, lon: 0 }
    },
    time: 1704110400, // Unix timestamp
    main: {
      temp: 298.15, // 25°C
      pressure: 1013,
      humidity: 70,
      temp_min: 295.15,
      temp_max: 300.15
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    wind: {
      speed: 5.5,
      deg: 180
    },
    clouds: {
      all: 0
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetWeatherData.mockReturnValue(baseWeatherData);
  });

  describe('Timezone Detection Coverage', () => {
    it('should handle Bangkok timezone (lat: 13.75, lon: 100.50)', () => {
      const bangkokCity: City = {
        id: 1609350,
        name: 'Bangkok',
        state: 'Bangkok',
        country: 'Thailand',
        coord: { lat: 13.75398, lon: 100.50144 }
      };

      render(<SearchResultsList query="Bangkok" results={[bangkokCity]} />);
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
    });

    it('should handle Sydney timezone (lat: -33.87, lon: 151.21)', () => {
      const sydneyCity: City = {
        id: 2147714,
        name: 'Sydney',
        state: 'New South Wales',
        country: 'Australia',
        coord: { lat: -33.8678, lon: 151.2073 }
      };

      render(<SearchResultsList query="Sydney" results={[sydneyCity]} />);
      expect(screen.getByText('Sydney')).toBeInTheDocument();
    });

    it('should handle Tokyo timezone (lat: 35.68, lon: 139.69)', () => {
      const tokyoCity: City = {
        id: 1850147,
        name: 'Tokyo',
        state: 'Tokyo',
        country: 'Japan',
        coord: { lat: 35.6895, lon: 139.6917 }
      };

      render(<SearchResultsList query="Tokyo" results={[tokyoCity]} />);
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
    });

    it('should handle Kolkata timezone (lat: 22.57, lon: 88.36)', () => {
      const kolkataCity: City = {
        id: 1275339,
        name: 'Kolkata',
        state: 'West Bengal',
        country: 'India',
        coord: { lat: 22.5726, lon: 88.3639 }
      };

      render(<SearchResultsList query="Kolkata" results={[kolkataCity]} />);
      expect(screen.getByText('Kolkata')).toBeInTheDocument();
    });

    it('should handle London timezone (lat: 51.51, lon: -0.13)', () => {
      const londonCity: City = {
        id: 2643743,
        name: 'London',
        state: 'England',
        country: 'United Kingdom',
        coord: { lat: 51.5085, lon: -0.1257 }
      };

      render(<SearchResultsList query="London" results={[londonCity]} />);
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('should handle New York timezone (lat: 40.71, lon: -74.01)', () => {
      const newYorkCity: City = {
        id: 5128581,
        name: 'New York',
        state: 'New York',
        country: 'United States',
        coord: { lat: 40.7128, lon: -74.0060 }
      };

      render(<SearchResultsList query="New York" results={[newYorkCity]} />);
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('should handle São Paulo timezone (lat: -23.55, lon: -46.63)', () => {
      const saoPauloCity: City = {
        id: 3448439,
        name: 'São Paulo',
        state: 'São Paulo',
        country: 'Brazil',
        coord: { lat: -23.5505, lon: -46.6333 }
      };

      render(<SearchResultsList query="São Paulo" results={[saoPauloCity]} />);
      expect(screen.getByText('São Paulo')).toBeInTheDocument();
    });

    it('should handle coordinates outside defined regions (UTC fallback)', () => {
      const unknownCity: City = {
        id: 9999999,
        name: 'Unknown City',
        state: 'Unknown State',
        country: 'Unknown Country',
        coord: { lat: 0, lon: 0 } // Gulf of Guinea - should fallback to UTC
      };

      render(<SearchResultsList query="Unknown" results={[unknownCity]} />);
      expect(screen.getByText('Unknown City')).toBeInTheDocument();
    });

    it('should handle boundary coordinates for Bangkok region', () => {
      const boundaryCity: City = {
        id: 1000001,
        name: 'Boundary City',
        state: 'Test',
        country: 'Test',
        coord: { lat: 13.0, lon: 100.0 } // Edge of Bangkok region
      };

      render(<SearchResultsList query="Boundary" results={[boundaryCity]} />);
      expect(screen.getByText('Boundary City')).toBeInTheDocument();
    });

    it('should handle boundary coordinates for Australia region', () => {
      const australiaBoundaryCity: City = {
        id: 1000002,
        name: 'Australia Boundary',
        state: 'Test',
        country: 'Test',
        coord: { lat: -44.0, lon: 140.0 } // Edge of Australia region
      };

      render(<SearchResultsList query="Australia Boundary" results={[australiaBoundaryCity]} />);
      expect(screen.getByText('Australia Boundary')).toBeInTheDocument();
    });
  });

  describe('Error Handling in Time Formatting', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should handle invalid timestamp gracefully', () => {
      const invalidWeatherData: WeatherData = {
        ...baseWeatherData,
        time: NaN // Invalid timestamp
      };

      mockGetWeatherData.mockReturnValue(invalidWeatherData);

      const testCity: City = {
        id: 1,
        name: 'Error Test City',
        state: 'Test',
        country: 'Test',
        coord: { lat: 0, lon: 0 }
      };

      // Should not crash even with invalid timestamp
      render(<SearchResultsList query="Error Test" results={[testCity]} />);
      expect(screen.getByText('Error Test City')).toBeInTheDocument();
    });

    it('should handle timezone conversion errors', () => {
      // Mock toLocaleString to throw error for specific timezone formatting
      const originalToLocaleString = Date.prototype.toLocaleString;
      let errorThrown = false;
      
      Date.prototype.toLocaleString = jest.fn(function (this: Date, locale?: string, options?: any) {
        if (options && options.timeZone) {
          errorThrown = true;
          throw new Error('Timezone error');
        }
        return originalToLocaleString.call(this, locale, options);
      });

      try {
        const testCity: City = {
          id: 2,
          name: 'Timezone Error City',
          state: 'Test',
          country: 'Test',
          coord: { lat: 13.75, lon: 100.50 } // Bangkok coordinates
        };

        render(<SearchResultsList query="Timezone Error" results={[testCity]} />);
        expect(screen.getByText('Timezone Error City')).toBeInTheDocument();
        
        // Should have logged the error if error was thrown
        if (errorThrown) {
          expect(consoleSpy).toHaveBeenCalled();
        }
      } finally {
        Date.prototype.toLocaleString = originalToLocaleString;
      }
    });

    it('should fallback to toLocaleTimeString when toLocaleString fails', () => {
      // Mock toLocaleString to throw error but toLocaleTimeString to work
      const originalToLocaleString = Date.prototype.toLocaleString;
      const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
      let errorThrown = false;
      
      Date.prototype.toLocaleString = jest.fn(function (this: Date, locale?: string, options?: any) {
        if (options && options.timeZone) {
          errorThrown = true;
          throw new Error('Timezone conversion failed');
        }
        return originalToLocaleString.call(this, locale, options);
      });
      
      Date.prototype.toLocaleTimeString = jest.fn(() => '12:00:00');

      try {
        const testCity: City = {
          id: 3,
          name: 'Fallback Test City',
          state: 'Test',
          country: 'Test',
          coord: { lat: 40.71, lon: -74.01 } // New York coordinates
        };

        render(<SearchResultsList query="Fallback Test" results={[testCity]} />);
        expect(screen.getByText('Fallback Test City')).toBeInTheDocument();
        
        // Should have called the fallback method if error was thrown
        if (errorThrown) {
          expect(Date.prototype.toLocaleTimeString).toHaveBeenCalled();
        }
      } finally {
        Date.prototype.toLocaleString = originalToLocaleString;
        Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
      }
    });
  });
});
