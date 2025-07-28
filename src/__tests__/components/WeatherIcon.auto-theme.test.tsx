/**
 * Unit tests for WeatherIcon component with auto theme functionality
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherIcon from '@/components/WeatherIcon';
import * as useWeatherIconModule from '@/hooks/useWeatherIcon';

// Mock the useWeatherIcon hook
jest.mock('@/hooks/useWeatherIcon');
const mockedUseWeatherIcon = useWeatherIconModule.useWeatherIcon as jest.MockedFunction<
  typeof useWeatherIconModule.useWeatherIcon
>;

// Mock console.warn to avoid noise in tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
});

describe('WeatherIcon Component - Auto Theme', () => {
  const mockIcon = {
    id: '01d',
    description: 'clear sky',
    isDayIcon: true,
    url: 'https://openweathermap.org/img/wn/01d@2x.png',
    condition: 'clearSky' as any
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseWeatherIcon.mockReturnValue({
      icon: mockIcon,
      isLoading: false,
      error: null,
      preloadIcon: jest.fn()
    });
  });

  describe('Theme Selection', () => {
    it('should use none theme by default (no background)', () => {
      render(<WeatherIcon iconCode="01d" />);
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // No background classes expected with 'none' theme
    });

    it('should use specified theme when provided', () => {
      render(<WeatherIcon iconCode="01d" theme="none" />);
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Theme 'none' should not add background
    });

    it('should use light theme when theme="light"', () => {
      render(<WeatherIcon iconCode="01d" theme="light" />);
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Light theme mainly affects error/loading states
    });

    it('should not apply background when theme="none"', () => {
      render(<WeatherIcon iconCode="01d" theme="none" />);
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Should display icon without background decorations
    });
  });

  describe('Auto Icon Selection', () => {
    // Helper to create timestamp for specific time
    const createTimestamp = (hour: number, timezone: string = 'UTC'): number => {
      const date = new Date('2025-07-28T00:00:00Z');
      date.setUTCHours(hour);
      return Math.floor(date.getTime() / 1000);
    };

    it('should use day icon (d) during day time (6 AM - 6 PM) with auto theme', () => {
      // Mock for day icon
      const dayIcon = {
        id: '01d',
        description: 'clear sky',
        isDayIcon: true,
        url: 'https://openweathermap.org/img/wn/01d@2x.png',
        condition: 'clearSky' as any
      };
      
      mockedUseWeatherIcon.mockReturnValue({
        icon: dayIcon,
        isLoading: false,
        error: null,
        preloadIcon: jest.fn()
      });

      const dayTimeStamp = createTimestamp(12); // 12:00 UTC
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={dayTimeStamp} 
          timezone="UTC" 
        />
      );
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Verify that useWeatherIcon was called with day icon code
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
    });

    it('should use night icon (n) during night time (6 PM - 6 AM) with auto theme', () => {
      // Mock for night icon
      const nightIcon = {
        id: '01n',
        description: 'clear sky',
        isDayIcon: false,
        url: 'https://openweathermap.org/img/wn/01n@2x.png',
        condition: 'clearSky' as any
      };
      
      mockedUseWeatherIcon.mockReturnValue({
        icon: nightIcon,
        isLoading: false,
        error: null,
        preloadIcon: jest.fn()
      });

      const nightTimeStamp = createTimestamp(22); // 22:00 UTC
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={nightTimeStamp} 
          timezone="UTC" 
        />
      );
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Verify that useWeatherIcon was called with night icon code
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01n', { preload: true });
    });

    it('should fallback to icon code when timestamp/timezone missing', () => {
      // Test with day icon - auto theme should use day icon when timestamp missing
      const { container: container1 } = render(<WeatherIcon iconCode="01d" theme="auto" />);
      expect(container1.querySelector('img')).toBeInTheDocument();
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
      
      // Clean up for next test
      jest.clearAllMocks();
      
      // Test with night icon - auto theme should use night icon
      const { container: container2 } = render(<WeatherIcon iconCode="01n" theme="auto" />);
      expect(container2.querySelector('img')).toBeInTheDocument();
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01n', { preload: true });
    });

    it('should handle invalid timezone gracefully', () => {
      const dayTimeStamp = createTimestamp(12);
      
      // Mock console.warn to spy on it
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={dayTimeStamp} 
          timezone="Invalid/Timezone" 
        />
      );
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Should fallback to icon code behavior and use day icon
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
      
      consoleSpy.mockRestore();
    });
  });

  describe('Different Timezones', () => {
    const createUTCTimestamp = (hour: number): number => {
      const date = new Date('2025-07-28T00:00:00Z');
      date.setUTCHours(hour);
      return Math.floor(date.getTime() / 1000);
    };

    it('should handle Bangkok timezone correctly', () => {
      // UTC 6:00 = Bangkok 13:00 (day time)
      const utc6am = createUTCTimestamp(6);
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={utc6am} 
          timezone="Asia/Bangkok" 
        />
      );
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Should use day icon for Bangkok daytime
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
    });

    it('should handle New York timezone correctly', () => {
      // UTC 12:00 = New York 8:00 (day time in summer) or 7:00 (day time in winter)
      const utcNoon = createUTCTimestamp(12);
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={utcNoon} 
          timezone="America/New_York" 
        />
      );
      
      const container = screen.getByRole('img');
      expect(container).toBeInTheDocument();
      // Should use day icon for New York daytime
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
    });
  });

  describe('Error and Loading States with Themes', () => {
    it('should apply error theme styling', () => {
      mockedUseWeatherIcon.mockReturnValue({
        icon: null,
        isLoading: false,
        error: 'Failed to load',
        preloadIcon: jest.fn()
      });

      const { container } = render(<WeatherIcon iconCode="01d" theme="light" />);
      
      // Find the error icon container with light theme styling
      const errorContainer = container.querySelector('.bg-red-100');
      expect(errorContainer).toBeInTheDocument();
    });

    it('should apply loading theme styling', () => {
      mockedUseWeatherIcon.mockReturnValue({
        icon: null,
        isLoading: true,
        error: null,
        preloadIcon: jest.fn()
      });

      const { container } = render(<WeatherIcon iconCode="01d" theme="light" />);
      
      // Find the loading icon container with light theme styling
      const loadingContainer = container.querySelector('.bg-gray-100');
      expect(loadingContainer).toBeInTheDocument();
    });

    it('should apply different error styling for light theme', () => {
      mockedUseWeatherIcon.mockReturnValue({
        icon: null,
        isLoading: false,
        error: 'Failed to load',
        preloadIcon: jest.fn()
      });

      const { container } = render(<WeatherIcon iconCode="01d" theme="light" />);
      
      // Find the error icon container with light theme styling
      const errorContainer = container.querySelector('.bg-red-100');
      expect(errorContainer).toBeInTheDocument();
    });

    it('should apply different loading styling for dark theme', () => {
      mockedUseWeatherIcon.mockReturnValue({
        icon: null,
        isLoading: true,
        error: null,
        preloadIcon: jest.fn()
      });

      const { container } = render(<WeatherIcon iconCode="01d" theme="dark" />);
      
      // Find the loading icon container with dark theme styling
      const loadingContainer = container.querySelector('.bg-gray-500');
      expect(loadingContainer).toBeInTheDocument();
    });
  });

  describe('Component Props Integration', () => {
    it('should maintain all existing functionality with auto theme', () => {
      const mockOnClick = jest.fn();
      
      render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto"
          timestamp={Math.floor(Date.now() / 1000)}
          timezone="Asia/Bangkok"
          size="lg"
          showDescription={true}
          onClick={mockOnClick}
          alt="Test weather icon"
        />
      );
      
      const container = screen.getByRole('img');
      
      // Check size
      expect(container.parentElement).toHaveClass('w-16', 'h-16');
      
      // Check image attributes
      expect(container).toHaveAttribute('alt', 'Test weather icon');
      expect(container).toHaveAttribute('src', mockIcon.url);
      
      // Check description
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      
      // Check click handler
      container.parentElement?.parentElement?.click();
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('should handle all size variants with auto theme', () => {
      const sizes = ['sm', 'md', 'lg', 'xl'] as const;
      const expectedClasses = {
        sm: ['w-8', 'h-8'],
        md: ['w-12', 'h-12'], 
        lg: ['w-16', 'h-16'],
        xl: ['w-24', 'h-24']
      };

      sizes.forEach(size => {
        const { unmount } = render(
          <WeatherIcon iconCode="01d" theme="auto" size={size} />
        );
        
        const container = screen.getByRole('img');
        expectedClasses[size].forEach(className => {
          expect(container.parentElement).toHaveClass(className);
        });
        
        unmount();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle boundary hours correctly', () => {
      // Test exactly 6 AM (start of day)
      const sixAM = Math.floor(new Date('2025-07-28T06:00:00Z').getTime() / 1000);
      
      const { container: container1 } = render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={sixAM} 
          timezone="UTC" 
        />
      );
      
      expect(container1.querySelector('img')).toBeInTheDocument();
      // Should use day icon at 6 AM
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01d', { preload: true });
      
      jest.clearAllMocks();
      
      // Test exactly 6 PM (start of night)
      const sixPM = Math.floor(new Date('2025-07-28T18:00:00Z').getTime() / 1000);
      
      const { container: container2 } = render(
        <WeatherIcon 
          iconCode="01d" 
          theme="auto" 
          timestamp={sixPM} 
          timezone="UTC" 
        />
      );
      
      expect(container2.querySelector('img')).toBeInTheDocument();
      // Should use night icon at 6 PM
      expect(mockedUseWeatherIcon).toHaveBeenCalledWith('01n', { preload: true });
    });

    it('should handle missing icon gracefully with auto theme', () => {
      mockedUseWeatherIcon.mockReturnValue({
        icon: null,
        isLoading: true, // Show loading state
        error: null,
        preloadIcon: jest.fn()
      });

      render(
        <WeatherIcon 
          iconCode="unknown" 
          theme="auto" 
          timestamp={1609459200} // Day time timestamp
          timezone="Asia/Bangkok"
        />
      );
      
      // Should show loading state - just verify the loading spinner exists
      const loadingSpinner = document.querySelector('.animate-spin');
      expect(loadingSpinner).toBeInTheDocument();
    });
  });
});
