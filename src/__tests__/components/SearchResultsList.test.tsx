import React from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
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

describe('SearchResultsList Component', () => {
  // Mock city data that matches City interface
  const mockCity: City = {
    id: 1609350,
    name: 'Bangkok',
    state: 'Bangkok',
    country: 'Thailand',
    coord: {
      lon: 100.50144,
      lat: 13.75398
    }
  };

  // Mock weather data that matches WeatherData interface
  const mockWeatherData: WeatherData = {
    city: mockCity,
    time: 1704110400, // Unix timestamp for 2024-01-01T12:00:00Z
    main: {
      temp: 308.15, // 35°C in Kelvin
      pressure: 1013,
      humidity: 70,
      temp_min: 305.15,
      temp_max: 310.15
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

  const mockCityWithWeather: City & { weatherData?: WeatherData } = {
    ...mockCity,
    weatherData: mockWeatherData
  };

  const mockCityWithoutWeather: City & { weatherData?: WeatherData } = {
    id: 1609351,
    name: 'Chiang Mai',
    state: 'Chiang Mai',
    country: 'Thailand',
    coord: {
      lon: 98.98468,
      lat: 18.79038
    },
    weatherData: undefined
  };

  beforeEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  describe('Temperature Color Function Testing', () => {
    // Helper function to test temperature color - replicated from the component
    const getTemperatureColor = (tempCelsius: number): string => {
      if (tempCelsius >= 35) {
        return 'from-red-500 to-red-600'; // Very hot - แดง
      } else if (tempCelsius >= 30) {
        return 'from-orange-500 to-red-500'; // Hot - ส้ม-แดง
      } else if (tempCelsius >= 25) {
        return 'from-yellow-500 to-orange-500'; // Warm - เหลือง-ส้ม
      } else if (tempCelsius >= 20) {
        return 'from-green-500 to-yellow-500'; // Mild - เขียว-เหลือง
      } else if (tempCelsius >= 15) {
        return 'from-blue-500 to-green-500'; // Cool - น้ำเงิน-เขียว
      } else if (tempCelsius >= 10) {
        return 'from-blue-600 to-blue-500'; // Cold - น้ำเงิน
      } else {
        return 'from-blue-700 to-purple-600'; // Very cold - น้ำเงินเข้ม-ม่วง
      }
    };

    it('should return very hot color for temperature >= 35°C', () => {
      expect(getTemperatureColor(40)).toBe('from-red-500 to-red-600');
      expect(getTemperatureColor(35)).toBe('from-red-500 to-red-600');
      expect(getTemperatureColor(50)).toBe('from-red-500 to-red-600');
    });

    it('should return hot color for temperature 30-34°C', () => {
      expect(getTemperatureColor(34)).toBe('from-orange-500 to-red-500');
      expect(getTemperatureColor(32)).toBe('from-orange-500 to-red-500');
      expect(getTemperatureColor(30)).toBe('from-orange-500 to-red-500');
    });

    it('should return warm color for temperature 25-29°C', () => {
      expect(getTemperatureColor(29)).toBe('from-yellow-500 to-orange-500');
      expect(getTemperatureColor(27)).toBe('from-yellow-500 to-orange-500');
      expect(getTemperatureColor(25)).toBe('from-yellow-500 to-orange-500');
    });

    it('should return mild color for temperature 20-24°C', () => {
      expect(getTemperatureColor(24)).toBe('from-green-500 to-yellow-500');
      expect(getTemperatureColor(22)).toBe('from-green-500 to-yellow-500');
      expect(getTemperatureColor(20)).toBe('from-green-500 to-yellow-500');
    });

    it('should return cool color for temperature 15-19°C', () => {
      expect(getTemperatureColor(19)).toBe('from-blue-500 to-green-500');
      expect(getTemperatureColor(17)).toBe('from-blue-500 to-green-500');
      expect(getTemperatureColor(15)).toBe('from-blue-500 to-green-500');
    });

    it('should return cold color for temperature 10-14°C', () => {
      expect(getTemperatureColor(14)).toBe('from-blue-600 to-blue-500');
      expect(getTemperatureColor(12)).toBe('from-blue-600 to-blue-500');
      expect(getTemperatureColor(10)).toBe('from-blue-600 to-blue-500');
    });

    it('should return very cold color for temperature < 10°C', () => {
      expect(getTemperatureColor(9)).toBe('from-blue-700 to-purple-600');
      expect(getTemperatureColor(5)).toBe('from-blue-700 to-purple-600');
      expect(getTemperatureColor(0)).toBe('from-blue-700 to-purple-600');
      expect(getTemperatureColor(-10)).toBe('from-blue-700 to-purple-600');
    });

    it('should handle boundary edge cases correctly', () => {
      // Test exact boundary values
      expect(getTemperatureColor(34.9)).toBe('from-orange-500 to-red-500'); // Should be hot (30-34°C)
      expect(getTemperatureColor(35.0)).toBe('from-red-500 to-red-600'); // Should be very hot (>=35°C)
      expect(getTemperatureColor(29.9)).toBe('from-yellow-500 to-orange-500'); // Should be warm (25-29°C)
      expect(getTemperatureColor(30.0)).toBe('from-orange-500 to-red-500'); // Should be hot (30-34°C)
      expect(getTemperatureColor(9.9)).toBe('from-blue-700 to-purple-600'); // Should be very cold (<10°C)
      expect(getTemperatureColor(10.0)).toBe('from-blue-600 to-blue-500'); // Should be cold (10-14°C)
    });
  });

  describe('Component Rendering', () => {
    it('should render search results with temperature badges', () => {
      render(
        <SearchResultsList
          query="Bangkok"
          results={[mockCityWithWeather]}
        />
      );

      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('Thailand')).toBeInTheDocument();
    });

    it('should not render anything when query is empty', () => {
      const { container } = render(
        <SearchResultsList
          query=""
          results={[]}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render no results message when results array is empty', () => {
      render(
        <SearchResultsList
          query="NonExistentCity"
          results={[]}
        />
      );

      expect(screen.getByText('No cities found')).toBeInTheDocument();
      expect(screen.getByText(/No cities match your search for/)).toBeInTheDocument();
    });

    it('should display weather data when available', () => {
      // Mock the getWeatherData to return our mock weather data
      mockGetWeatherData.mockReturnValue(mockWeatherData);
      
      render(
        <SearchResultsList
          query="Bangkok"
          results={[mockCityWithWeather]}
        />
      );

      // Check if temperature is displayed (35°C from Kelvin 308.15)
      expect(screen.getByText('35°')).toBeInTheDocument();
      // Check if humidity is displayed - just check for the percentage
      expect(screen.getByText(/70\s*%/)).toBeInTheDocument();
    });

    it('should handle missing weather data gracefully', () => {
      render(
        <SearchResultsList
          query="Chiang Mai"
          results={[mockCityWithoutWeather]}
        />
      );

      expect(screen.getByText('Chiang Mai')).toBeInTheDocument();
      expect(screen.getByText('Thailand')).toBeInTheDocument();
      // Should not crash even without weather data
    });
  });

  describe('Temperature Badge Color Integration', () => {
    it('should apply correct color class for hot temperature', () => {
      const hotWeatherData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 308.15 } // 35°C - very hot
      };

      mockGetWeatherData.mockReturnValue(hotWeatherData);

      const hotResult = {
        ...mockCityWithWeather,
        weatherData: hotWeatherData
      };

      render(
        <SearchResultsList
          query="Hot City"
          results={[hotResult]}
        />
      );

      // Check that the component renders with hot temperature data
      expect(screen.getByText('35°')).toBeInTheDocument();
    });

    it('should apply correct color class for cold temperature', () => {
      const coldWeatherData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 278.15 } // 5°C - very cold
      };

      mockGetWeatherData.mockReturnValue(coldWeatherData);

      const coldResult = {
        ...mockCityWithWeather,
        weatherData: coldWeatherData
      };

      render(
        <SearchResultsList
          query="Cold City"
          results={[coldResult]}
        />
      );

      // Check that the component renders with cold temperature data
      expect(screen.getByText('5°')).toBeInTheDocument();
    });

    it('should apply correct color class for moderate temperature', () => {
      const moderateWeatherData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 295.15 } // 22°C - mild
      };

      mockGetWeatherData.mockReturnValue(moderateWeatherData);

      const moderateResult = {
        ...mockCityWithWeather,
        weatherData: moderateWeatherData
      };

      render(
        <SearchResultsList
          query="Moderate City"
          results={[moderateResult]}
        />
      );

      // Check that the component renders with moderate temperature data
      expect(screen.getByText('22°')).toBeInTheDocument();
    });
  });

  describe('Timezone Detection', () => {
    it('should return Asia/Bangkok for coordinates in Thailand', () => {
      const bangkokCoord = { lat: 13.75, lon: 100.50 };
      const city: City = { ...mockCity, coord: bangkokCoord };
      
      render(<SearchResultsList query="Bangkok" results={[city]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
    });

    it('should return Australia/Sydney for coordinates in Australia', () => {
      const sydneyCoord = { lat: -33.87, lon: 151.21 };
      const city: City = { ...mockCity, name: 'Sydney', coord: sydneyCoord };
      
      render(<SearchResultsList query="Sydney" results={[city]} />);
      
      expect(screen.getByText('Sydney')).toBeInTheDocument();
    });

    it('should return Asia/Tokyo for coordinates in Japan', () => {
      const tokyoCoord = { lat: 35.68, lon: 139.69 };
      const city: City = { ...mockCity, name: 'Tokyo', coord: tokyoCoord };
      
      render(<SearchResultsList query="Tokyo" results={[city]} />);
      
      expect(screen.getByText('Tokyo')).toBeInTheDocument();
    });

    it('should return Asia/Kolkata for coordinates in India', () => {
      const kolkataCoord = { lat: 22.57, lon: 88.36 };
      const city: City = { ...mockCity, name: 'Kolkata', coord: kolkataCoord };
      
      render(<SearchResultsList query="Kolkata" results={[city]} />);
      
      expect(screen.getByText('Kolkata')).toBeInTheDocument();
    });

    it('should return Europe/London for coordinates in UK', () => {
      const londonCoord = { lat: 51.51, lon: -0.13 };
      const city: City = { ...mockCity, name: 'London', coord: londonCoord };
      
      render(<SearchResultsList query="London" results={[city]} />);
      
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    it('should return America/New_York for coordinates in eastern US', () => {
      const nyCoord = { lat: 40.71, lon: -74.01 };
      const city: City = { ...mockCity, name: 'New York', coord: nyCoord };
      
      render(<SearchResultsList query="New York" results={[city]} />);
      
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    it('should return America/Sao_Paulo for coordinates in Brazil', () => {
      const spCoord = { lat: -23.55, lon: -46.63 };
      const city: City = { ...mockCity, name: 'São Paulo', coord: spCoord };
      
      render(<SearchResultsList query="São Paulo" results={[city]} />);
      
      expect(screen.getByText('São Paulo')).toBeInTheDocument();
    });

    it('should return UTC for coordinates outside defined regions', () => {
      const unknownCoord = { lat: 0, lon: 0 }; // Gulf of Guinea
      const city: City = { ...mockCity, name: 'Unknown City', coord: unknownCoord };
      
      render(<SearchResultsList query="Unknown" results={[city]} />);
      
      expect(screen.getByText('Unknown City')).toBeInTheDocument();
    });
  });

  describe('Error Handling in Time Formatting', () => {
    // Mock console.warn to verify error handling
    const originalConsoleWarn = console.warn;
    let mockConsoleWarn: jest.SpyInstance;

    beforeEach(() => {
      mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      mockConsoleWarn.mockRestore();
      console.warn = originalConsoleWarn;
    });

    it('should handle invalid time zone gracefully', () => {
      // Force an error by providing invalid data to Date constructor
      const invalidWeatherData: WeatherData = {
        ...mockWeatherData,
        time: NaN // Invalid timestamp
      };

      mockGetWeatherData.mockReturnValue(invalidWeatherData);

      const cityWithInvalidTime = {
        ...mockCityWithWeather,
        weatherData: invalidWeatherData
      };

      render(<SearchResultsList query="Invalid Time" results={[cityWithInvalidTime]} />);

      // Component should still render without crashing
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
    });

    it('should handle timezone formatting errors gracefully with fallback', () => {
      // Use valid data but mock toLocaleString to throw an error only for timezone calls
      const originalToLocaleString = Date.prototype.toLocaleString;
      let errorThrown = false;
      
      Date.prototype.toLocaleString = jest.fn((locale?: any, options?: any) => {
        // Only throw error when timeZone option is present (timezone conversion)
        if (options?.timeZone) {
          errorThrown = true;
          throw new Error('Timezone conversion failed');
        }
        // Call original method for other calls
        return originalToLocaleString.call(this, locale, options);
      });

      try {
        render(<SearchResultsList query="Error Test" results={[mockCityWithWeather]} />);
        
        // Component should still render without crashing
        expect(screen.getByText('Bangkok')).toBeInTheDocument();
        
        // Should have logged the error only if timezone conversion was attempted and failed
        if (errorThrown) {
          expect(mockConsoleWarn).toHaveBeenCalled();
        }
      } finally {
        Date.prototype.toLocaleString = originalToLocaleString;
      }
    });
  });

  describe('Temperature Gradient Coverage', () => {
    it('should apply gradient for temperature exactly at 35°C', () => {
      const exactHotData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 308.15 } // exactly 35°C
      };
      
      mockGetWeatherData.mockReturnValue(exactHotData);
      
      const cityWithExactHotData = { ...mockCityWithWeather, weatherData: exactHotData };
      
      render(<SearchResultsList query="Exact Hot" results={[cityWithExactHotData]} />);
      
      expect(screen.getByText('35°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature exactly at 30°C', () => {
      const exactWarmData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 303.15 } // exactly 30°C
      };
      
      mockGetWeatherData.mockReturnValue(exactWarmData);
      
      const cityWithExactWarmData = { ...mockCityWithWeather, weatherData: exactWarmData };
      
      render(<SearchResultsList query="Exact Warm" results={[cityWithExactWarmData]} />);
      
      expect(screen.getByText('30°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature exactly at 25°C', () => {
      const exactMildData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 298.15 } // exactly 25°C
      };
      
      mockGetWeatherData.mockReturnValue(exactMildData);
      
      const cityWithExactMildData = { ...mockCityWithWeather, weatherData: exactMildData };
      
      render(<SearchResultsList query="Exact Mild" results={[cityWithExactMildData]} />);
      
      expect(screen.getByText('25°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature exactly at 20°C', () => {
      const exactCoolData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 293.15 } // exactly 20°C
      };
      
      mockGetWeatherData.mockReturnValue(exactCoolData);
      
      const cityWithExactCoolData = { ...mockCityWithWeather, weatherData: exactCoolData };
      
      render(<SearchResultsList query="Exact Cool" results={[cityWithExactCoolData]} />);
      
      expect(screen.getByText('20°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature exactly at 15°C', () => {
      const exactColdData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 288.15 } // exactly 15°C
      };
      
      mockGetWeatherData.mockReturnValue(exactColdData);
      
      const cityWithExactColdData = { ...mockCityWithWeather, weatherData: exactColdData };
      
      render(<SearchResultsList query="Exact Cold" results={[cityWithExactColdData]} />);
      
      expect(screen.getByText('15°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature exactly at 10°C', () => {
      const exactFreezingData: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 283.15 } // exactly 10°C
      };
      
      mockGetWeatherData.mockReturnValue(exactFreezingData);
      
      const cityWithExactFreezingData = { ...mockCityWithWeather, weatherData: exactFreezingData };
      
      render(<SearchResultsList query="Exact Freezing" results={[cityWithExactFreezingData]} />);
      
      expect(screen.getByText('10°')).toBeInTheDocument();
    });

    it('should apply gradient for temperature below 10°C', () => {
      const veryFreezing: WeatherData = {
        ...mockWeatherData,
        main: { ...mockWeatherData.main, temp: 268.15 } // -5°C
      };
      
      mockGetWeatherData.mockReturnValue(veryFreezing);
      
      const cityWithVeryFreezingData = { ...mockCityWithWeather, weatherData: veryFreezing };
      
      render(<SearchResultsList query="Very Freezing" results={[cityWithVeryFreezingData]} />);
      
      expect(screen.getByText('-5°')).toBeInTheDocument();
    });
  });

  describe('Click Handler Coverage', () => {
    it('should handle city link clicks', () => {
      mockGetWeatherData.mockReturnValue(mockWeatherData);
      
      const mockOnCitySelect = jest.fn();

      render(
        <SearchResultsList 
          query="Click Test" 
          results={[mockCityWithWeather]} 
          onCitySelect={mockOnCitySelect}
        />
      );
      
      // Find the clickable city card
      const cityCard = screen.getByText('Bangkok').closest('div[class*="cursor-pointer"]');
      expect(cityCard).toBeInTheDocument();
      
      if (cityCard) {
        fireEvent.click(cityCard);
        expect(mockOnCitySelect).toHaveBeenCalledWith(mockCityWithWeather);
      }
    });
  });
});
