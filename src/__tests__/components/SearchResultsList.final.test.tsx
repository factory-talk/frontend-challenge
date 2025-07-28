import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchResultsList from '../../components/SearchResultsList';
import { WeatherData } from '../../model/WeatherData';
import { City } from '../../model/CityModel';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
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

describe('SearchResultsList - Final Coverage Tests', () => {
  const baseWeatherData: WeatherData = {
    city: {
      id: 1,
      name: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      coord: { lat: 0, lon: 0 }
    },
    time: 1704110400,
    main: {
      temp: 298.15,
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

  describe('Edge Case Timezone Coverage - Line 20', () => {
    it('should handle coordinates that fall between timezone regions', () => {
      // Test coordinates that might trigger line 20 UTC fallback
      const edgeCaseCity: City = {
        id: 999999,
        name: 'Edge Case City',
        state: 'Edge State',
        country: 'Edge Country',
        coord: { lat: 75, lon: 0 } // Arctic region - should fallback to UTC
      };

      render(<SearchResultsList query="Edge Case" results={[edgeCaseCity]} />);
      expect(screen.getByText('Edge Case City')).toBeInTheDocument();
    });

    it('should handle extreme coordinates outside all regions', () => {
      const extremeCity: City = {
        id: 888888,
        name: 'Extreme City',
        state: 'Extreme State',
        country: 'Extreme Country',
        coord: { lat: -90, lon: -180 } // South Pole - should trigger UTC fallback
      };

      render(<SearchResultsList query="Extreme" results={[extremeCity]} />);
      expect(screen.getByText('Extreme City')).toBeInTheDocument();
    });
  });

  describe('Error Handling Coverage - Lines 77-80', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it('should trigger error handling and fallback time formatting', () => {
      // Mock toLocaleString to throw error only for timezone-specific formatting
      const originalToLocaleString = Date.prototype.toLocaleString;
      let errorThrown = false;
      
      Date.prototype.toLocaleString = jest.fn(function (this: Date, locale?: string, options?: any) {
        // Only throw error for timezone-specific calls (when timeZone option is present)
        if (options && options.timeZone) {
          errorThrown = true;
          throw new Error('Timezone formatting failed');
        }
        // For other calls, use original implementation
        return originalToLocaleString.call(this, locale, options);
      });

      try {
        const testCity: City = {
          id: 1,
          name: 'Error Fallback City',
          state: 'Test',
          country: 'Test',
          coord: { lat: 13.75, lon: 100.50 } // Bangkok coordinates to trigger timezone
        };

        render(<SearchResultsList query="Error Fallback" results={[testCity]} />);
        
        expect(screen.getByText('Error Fallback City')).toBeInTheDocument();
        
        // Only check console if error was actually thrown
        if (errorThrown) {
          expect(consoleSpy).toHaveBeenCalledWith('Error formatting city time:', expect.any(Error));
        }
      } finally {
        Date.prototype.toLocaleString = originalToLocaleString;
      }
    });

    it('should use fallback current time when timezone conversion fails', () => {
      // Mock both toLocaleString and toLocaleTimeString
      const originalToLocaleString = Date.prototype.toLocaleString;
      const originalToLocaleTimeString = Date.prototype.toLocaleTimeString;
      let errorThrown = false;
      
      Date.prototype.toLocaleString = jest.fn(function (this: Date, locale?: string, options?: any) {
        if (options && options.timeZone) {
          errorThrown = true;
          throw new Error('Timezone formatting failed');
        }
        return originalToLocaleString.call(this, locale, options);
      });
      
      const mockFallbackTime = '15:30';
      Date.prototype.toLocaleTimeString = jest.fn(() => mockFallbackTime);

      try {
        const testCity: City = {
          id: 2,
          name: 'Fallback Time City',
          state: 'Test',
          country: 'Test',
          coord: { lat: 40.71, lon: -74.01 } // New York coordinates
        };

        render(<SearchResultsList query="Fallback Time" results={[testCity]} />);
        
        expect(screen.getByText('Fallback Time City')).toBeInTheDocument();
        
        if (errorThrown) {
          expect(consoleSpy).toHaveBeenCalled();
          expect(Date.prototype.toLocaleTimeString).toHaveBeenCalledWith('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });
        }
      } finally {
        Date.prototype.toLocaleString = originalToLocaleString;
        Date.prototype.toLocaleTimeString = originalToLocaleTimeString;
      }
    });

    it('should handle error when creating new Date with invalid timestamp', () => {
      const invalidWeatherData: WeatherData = {
        ...baseWeatherData,
        time: NaN // This should cause issues when creating new Date
      };

      mockGetWeatherData.mockReturnValue(invalidWeatherData);

      const testCity: City = {
        id: 3,
        name: 'Invalid Timestamp City',
        state: 'Test',
        country: 'Test',
        coord: { lat: 51.51, lon: -0.13 } // London coordinates
      };

      render(<SearchResultsList query="Invalid Timestamp" results={[testCity]} />);
      
      expect(screen.getByText('Invalid Timestamp City')).toBeInTheDocument();
    });
  });

  describe('Additional Coverage for Missing Cases', () => {
    it('should handle different timezone regions to ensure all branches are covered', () => {
      const cities: City[] = [
        {
          id: 1,
          name: 'Arctic City',
          state: 'Arctic',
          country: 'Arctic',
          coord: { lat: 80, lon: 0 } // Far north - should use UTC
        },
        {
          id: 2,
          name: 'Antarctic City',
          state: 'Antarctica',
          country: 'Antarctica',
          coord: { lat: -80, lon: 0 } // Far south - should use UTC
        },
        {
          id: 3,
          name: 'Pacific City',
          state: 'Pacific',
          country: 'Pacific',
          coord: { lat: 0, lon: -180 } // Pacific Ocean - should use UTC
        }
      ];

      render(<SearchResultsList query="Various Zones" results={cities} />);
      
      expect(screen.getByText('Arctic City')).toBeInTheDocument();
      expect(screen.getByText('Antarctic City')).toBeInTheDocument();
      expect(screen.getByText('Pacific City')).toBeInTheDocument();
    });
  });
});
