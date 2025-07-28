import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

describe('SearchResultsList - Temperature Gradient & Click Coverage', () => {
  const baseCity: City = {
    id: 1609350,
    name: 'Bangkok',
    state: 'Bangkok',
    country: 'Thailand',
    coord: { lat: 13.75398, lon: 100.50144 }
  };

  const createWeatherData = (tempKelvin: number): WeatherData => ({
    city: baseCity,
    time: 1704110400,
    main: {
      temp: tempKelvin,
      pressure: 1013,
      humidity: 70,
      temp_min: tempKelvin - 5,
      temp_max: tempKelvin + 5
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
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Temperature Gradient Exact Boundary Coverage', () => {
    it('should handle temperature >= 35°C (very hot)', () => {
      const veryHotWeather = createWeatherData(308.15); // 35°C
      mockGetWeatherData.mockReturnValue(veryHotWeather);

      render(<SearchResultsList query="Very Hot" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('35°')).toBeInTheDocument();
    });

    it('should handle temperature at 36°C (very hot)', () => {
      const veryHotWeather = createWeatherData(309.15); // 36°C
      mockGetWeatherData.mockReturnValue(veryHotWeather);

      render(<SearchResultsList query="Very Hot 36" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('36°')).toBeInTheDocument();
    });

    it('should handle temperature exactly 30°C (hot)', () => {
      const hotWeather = createWeatherData(303.15); // 30°C
      mockGetWeatherData.mockReturnValue(hotWeather);

      render(<SearchResultsList query="Hot 30" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('30°')).toBeInTheDocument();
    });

    it('should handle temperature at 34°C (hot)', () => {
      const hotWeather = createWeatherData(307.15); // 34°C
      mockGetWeatherData.mockReturnValue(hotWeather);

      render(<SearchResultsList query="Hot 34" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('34°')).toBeInTheDocument();
    });

    it('should handle temperature exactly 25°C (warm)', () => {
      const warmWeather = createWeatherData(298.15); // 25°C
      mockGetWeatherData.mockReturnValue(warmWeather);

      render(<SearchResultsList query="Warm 25" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('25°')).toBeInTheDocument();
    });

    it('should handle temperature at 29°C (warm)', () => {
      const warmWeather = createWeatherData(302.15); // 29°C
      mockGetWeatherData.mockReturnValue(warmWeather);

      render(<SearchResultsList query="Warm 29" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('29°')).toBeInTheDocument();
    });

    it('should handle temperature exactly 20°C (mild)', () => {
      const mildWeather = createWeatherData(293.15); // 20°C
      mockGetWeatherData.mockReturnValue(mildWeather);

      render(<SearchResultsList query="Mild 20" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('20°')).toBeInTheDocument();
    });

    it('should handle temperature at 24°C (mild)', () => {
      const mildWeather = createWeatherData(297.15); // 24°C
      mockGetWeatherData.mockReturnValue(mildWeather);

      render(<SearchResultsList query="Mild 24" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('24°')).toBeInTheDocument();
    });

    it('should handle temperature exactly 15°C (cool)', () => {
      const coolWeather = createWeatherData(288.15); // 15°C
      mockGetWeatherData.mockReturnValue(coolWeather);

      render(<SearchResultsList query="Cool 15" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('15°')).toBeInTheDocument();
    });

    it('should handle temperature at 19°C (cool)', () => {
      const coolWeather = createWeatherData(292.15); // 19°C
      mockGetWeatherData.mockReturnValue(coolWeather);

      render(<SearchResultsList query="Cool 19" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('19°')).toBeInTheDocument();
    });

    it('should handle temperature exactly 10°C (cold)', () => {
      const coldWeather = createWeatherData(283.15); // 10°C
      mockGetWeatherData.mockReturnValue(coldWeather);

      render(<SearchResultsList query="Cold 10" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('10°')).toBeInTheDocument();
    });

    it('should handle temperature at 14°C (cold)', () => {
      const coldWeather = createWeatherData(287.15); // 14°C
      mockGetWeatherData.mockReturnValue(coldWeather);

      render(<SearchResultsList query="Cold 14" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('14°')).toBeInTheDocument();
    });

    it('should handle temperature below 10°C (very cold)', () => {
      const veryColdWeather = createWeatherData(278.15); // 5°C
      mockGetWeatherData.mockReturnValue(veryColdWeather);

      render(<SearchResultsList query="Very Cold 5" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('5°')).toBeInTheDocument();
    });

    it('should handle temperature at -5°C (very cold)', () => {
      const veryColdWeather = createWeatherData(268.15); // -5°C
      mockGetWeatherData.mockReturnValue(veryColdWeather);

      render(<SearchResultsList query="Very Cold -5" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('-5°')).toBeInTheDocument();
    });

    it('should handle temperature at 9°C (very cold edge case)', () => {
      const veryColdWeather = createWeatherData(282.15); // 9°C
      mockGetWeatherData.mockReturnValue(veryColdWeather);

      render(<SearchResultsList query="Very Cold 9" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('9°')).toBeInTheDocument();
    });
  });

  describe('Click Handler Coverage', () => {
    it('should render clickable city cards with Detail button', () => {
      const testWeather = createWeatherData(298.15); // 25°C
      mockGetWeatherData.mockReturnValue(testWeather);

      render(<SearchResultsList query="Click Test" results={[baseCity]} />);
      
      const detailButton = screen.getByRole('button', { name: /detail/i });
      expect(detailButton).toBeInTheDocument();
    });

    it('should handle multiple city cards correctly', () => {
      const testWeather = createWeatherData(298.15); // 25°C
      mockGetWeatherData.mockReturnValue(testWeather);

      const multiCities: City[] = [
        { ...baseCity, id: 1, name: 'City 1' },
        { ...baseCity, id: 2, name: 'City 2' },
        { ...baseCity, id: 3, name: 'City 3' }
      ];

      render(<SearchResultsList query="Multi Cities" results={multiCities} />);
      
      const detailButtons = screen.getAllByRole('button', { name: /detail/i });
      expect(detailButtons).toHaveLength(3);
    });

    it('should handle click events on city cards', () => {
      const testWeather = createWeatherData(298.15); // 25°C
      mockGetWeatherData.mockReturnValue(testWeather);
      
      const mockOnCitySelect = jest.fn();

      render(
        <SearchResultsList 
          query="Click Event Test" 
          results={[baseCity]} 
          onCitySelect={mockOnCitySelect}
        />
      );
      
      const cityCard = screen.getByText('Bangkok').closest('div[class*="cursor-pointer"]');
      expect(cityCard).toBeInTheDocument();
      
      // Simulate click event on city card
      if (cityCard) {
        fireEvent.click(cityCard);
        expect(mockOnCitySelect).toHaveBeenCalledWith(baseCity);
      }
    });

    it('should render city card with proper accessibility', () => {
      const testWeather = createWeatherData(298.15); // 25°C
      mockGetWeatherData.mockReturnValue(testWeather);

      render(<SearchResultsList query="Accessibility Test" results={[baseCity]} />);
      
      const detailButton = screen.getByRole('button', { name: /detail/i });
      expect(detailButton).toBeInTheDocument();
      
      // Check that the button is properly labeled
      expect(detailButton).toHaveTextContent('Detail');
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle extreme high temperature (50°C)', () => {
      const extremeHotWeather = createWeatherData(323.15); // 50°C
      mockGetWeatherData.mockReturnValue(extremeHotWeather);

      render(<SearchResultsList query="Extreme Hot" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('50°')).toBeInTheDocument();
    });

    it('should handle extreme low temperature (-20°C)', () => {
      const extremeColdWeather = createWeatherData(253.15); // -20°C
      mockGetWeatherData.mockReturnValue(extremeColdWeather);

      render(<SearchResultsList query="Extreme Cold" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('-20°')).toBeInTheDocument();
    });

    it('should handle decimal temperature values', () => {
      const decimalWeather = createWeatherData(298.65); // 25.5°C (should round to 26°C)
      mockGetWeatherData.mockReturnValue(decimalWeather);

      render(<SearchResultsList query="Decimal Temp" results={[baseCity]} />);
      
      expect(screen.getByText('Bangkok')).toBeInTheDocument();
      expect(screen.getByText('26°')).toBeInTheDocument();
    });
  });
});
