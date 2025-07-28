import { renderHook, act, waitFor } from '@testing-library/react';
import { useWeatherIcon, useWeatherIconPreloader } from '@/hooks/useWeatherIcon';
import { WeatherIconService, WeatherIcon, WeatherCondition } from '@/service/weatherIconService';

// Mock the WeatherIconService
jest.mock('@/service/weatherIconService');

const mockWeatherIcon: WeatherIcon = {
  id: '01d',
  description: 'clear sky',
  isDayIcon: true,
  url: 'https://openweathermap.org/img/wn/01d@2x.png',
  condition: WeatherCondition.CLEAR_SKY
};

const mockFallbackIcon: WeatherIcon = {
  id: '01d',
  description: 'clear sky',
  isDayIcon: true,
  url: 'https://openweathermap.org/img/wn/01d@2x.png',
  condition: WeatherCondition.CLEAR_SKY
};

const mockedWeatherIconService = WeatherIconService as jest.Mocked<typeof WeatherIconService>;

describe('useWeatherIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useWeatherIcon(null));

      expect(result.current.icon).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.preloadIcon).toBe('function');
    });

    it('should return null icon when iconCode is null', () => {
      const { result } = renderHook(() => useWeatherIcon(null));

      expect(result.current.icon).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should load weather icon successfully', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);

      const { result } = renderHook(() => useWeatherIcon('01d'));

      await waitFor(() => {
        expect(result.current.icon).toEqual(mockWeatherIcon);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
      });

      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledWith('01d');
    });

    it('should handle loading state', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);

      const { result } = renderHook(() => useWeatherIcon('01d'));

      // Should eventually finish loading
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should update icon when iconCode changes', async () => {
      const rainIcon: WeatherIcon = {
        id: '10d',
        description: 'rain',
        isDayIcon: true,
        url: 'https://openweathermap.org/img/wn/10d@2x.png',
        condition: WeatherCondition.RAIN
      };

      mockedWeatherIconService.getIconByCode
        .mockReturnValueOnce(mockWeatherIcon)
        .mockReturnValueOnce(rainIcon);

      const { result, rerender } = renderHook(
        ({ iconCode }) => useWeatherIcon(iconCode),
        { initialProps: { iconCode: '01d' } }
      );

      await waitFor(() => {
        expect(result.current.icon).toEqual(mockWeatherIcon);
      });

      // Change icon code
      rerender({ iconCode: '10d' });

      await waitFor(() => {
        expect(result.current.icon).toEqual(rainIcon);
      });

      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledWith('01d');
      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledWith('10d');
    });
  });

  describe('preloading functionality', () => {
    it('should preload icon when preload option is true', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);
      mockedWeatherIconService.preloadIcon.mockResolvedValue();

      const { result } = renderHook(() => 
        useWeatherIcon('01d', { preload: true })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedWeatherIconService.preloadIcon).toHaveBeenCalledWith('01d');
      expect(result.current.icon).toEqual(mockWeatherIcon);
    });

    it('should not preload when preload option is false', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);

      const { result } = renderHook(() => 
        useWeatherIcon('01d', { preload: false })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedWeatherIconService.preloadIcon).not.toHaveBeenCalled();
      expect(result.current.icon).toEqual(mockWeatherIcon);
    });

    it('should handle preload icon function', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);
      mockedWeatherIconService.preloadIcon.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIcon('01d'));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.preloadIcon('02d');
      });

      expect(mockedWeatherIconService.preloadIcon).toHaveBeenCalledWith('02d');
    });

    it('should handle preload errors gracefully', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);
      mockedWeatherIconService.preloadIcon.mockRejectedValue(new Error('Preload failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useWeatherIcon('01d'));

      await act(async () => {
        await result.current.preloadIcon('02d');
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to preload icon:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    it('should handle invalid icon code', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(null);

      const { result } = renderHook(() => useWeatherIcon('invalid'));

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid icon code: invalid');
        expect(result.current.icon).toBeNull();
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('should use fallback icon when main icon fails', async () => {
      mockedWeatherIconService.getIconByCode
        .mockReturnValueOnce(null) // First call fails
        .mockReturnValueOnce(mockFallbackIcon); // Fallback succeeds

      const { result } = renderHook(() => 
        useWeatherIcon('invalid', { fallbackIcon: '01d' })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid icon code: invalid');
        expect(result.current.icon).toEqual(mockFallbackIcon);
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledWith('invalid');
      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledWith('01d');
    });

    it('should not use fallback when main icon is same as fallback', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(null);

      const { result } = renderHook(() => 
        useWeatherIcon('01d', { fallbackIcon: '01d' })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid icon code: 01d');
        expect(result.current.icon).toBeNull();
      });

      expect(mockedWeatherIconService.getIconByCode).toHaveBeenCalledTimes(1);
    });

    it('should handle fallback icon failure gracefully', async () => {
      mockedWeatherIconService.getIconByCode
        .mockReturnValueOnce(null) // Main icon fails
        .mockImplementationOnce(() => { // Fallback fails
          throw new Error('Fallback failed');
        });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => 
        useWeatherIcon('invalid', { fallbackIcon: '02d' })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Invalid icon code: invalid');
        expect(result.current.icon).toBeNull();
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to load fallback icon:', expect.any(Error));
      consoleSpy.mockRestore();
    });

    it('should handle preload errors when preload is enabled', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);
      mockedWeatherIconService.preloadIcon.mockRejectedValue(new Error('Preload failed'));

      const { result } = renderHook(() => 
        useWeatherIcon('01d', { preload: true, fallbackIcon: '01d' })
      );

      await waitFor(() => {
        expect(result.current.error).toBe('Preload failed');
        expect(result.current.icon).toEqual(mockWeatherIcon); // Should still set the icon even if preload fails
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('cleanup', () => {
    it('should reset state when iconCode becomes null', async () => {
      mockedWeatherIconService.getIconByCode.mockReturnValue(mockWeatherIcon);

      const { result, rerender } = renderHook(
        ({ iconCode }: { iconCode: string | null }) => useWeatherIcon(iconCode),
        { initialProps: { iconCode: '01d' } }
      );

      await waitFor(() => {
        expect(result.current.icon).toEqual(mockWeatherIcon);
      });

      // Set iconCode to empty string
      rerender({ iconCode: '' });

      expect(result.current.icon).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});

describe('useWeatherIconPreloader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('basic functionality', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useWeatherIconPreloader());

      expect(result.current.isPreloading).toBe(false);
      expect(result.current.preloadedIcons).toEqual([]);
      expect(typeof result.current.preloadIcons).toBe('function');
      expect(typeof result.current.preloadCommonIcons).toBe('function');
      expect(typeof result.current.isIconPreloaded).toBe('function');
    });

    it('should preload multiple icons successfully', async () => {
      mockedWeatherIconService.preloadIcons.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIconPreloader());

      await act(async () => {
        await result.current.preloadIcons(['01d', '02d', '03d']);
      });

      expect(mockedWeatherIconService.preloadIcons).toHaveBeenCalledWith(['01d', '02d', '03d']);
      expect(result.current.preloadedIcons).toEqual(['01d', '02d', '03d']);
      expect(result.current.isPreloading).toBe(false);
    });

    it('should show loading state while preloading', async () => {
      let resolvePreload: () => void;
      const preloadPromise = new Promise<void>(resolve => {
        resolvePreload = resolve;
      });
      mockedWeatherIconService.preloadIcons.mockReturnValue(preloadPromise);

      const { result } = renderHook(() => useWeatherIconPreloader());

      // Start preloading
      act(() => {
        result.current.preloadIcons(['01d', '02d']);
      });

      expect(result.current.isPreloading).toBe(true);

      // Resolve preloading
      await act(async () => {
        resolvePreload();
        await preloadPromise;
      });

      expect(result.current.isPreloading).toBe(false);
    });

    it('should handle preload errors gracefully', async () => {
      mockedWeatherIconService.preloadIcons.mockRejectedValue(new Error('Preload failed'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const { result } = renderHook(() => useWeatherIconPreloader());

      await act(async () => {
        await result.current.preloadIcons(['01d', '02d']);
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to preload weather icons:', expect.any(Error));
      expect(result.current.isPreloading).toBe(false);
      expect(result.current.preloadedIcons).toEqual([]); // Should remain empty on error

      consoleSpy.mockRestore();
    });

    it('should check if icon is preloaded', async () => {
      mockedWeatherIconService.preloadIcons.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIconPreloader());

      expect(result.current.isIconPreloaded('01d')).toBe(false);

      await act(async () => {
        await result.current.preloadIcons(['01d', '02d']);
      });

      expect(result.current.isIconPreloaded('01d')).toBe(true);
      expect(result.current.isIconPreloaded('02d')).toBe(true);
      expect(result.current.isIconPreloaded('03d')).toBe(false);
    });

    it('should preload common icons', async () => {
      mockedWeatherIconService.preloadCommonIcons.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIconPreloader());

      await act(async () => {
        await result.current.preloadCommonIcons();
      });

      expect(mockedWeatherIconService.preloadCommonIcons).toHaveBeenCalled();
    });

    it('should accumulate preloaded icons from multiple calls', async () => {
      mockedWeatherIconService.preloadIcons.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIconPreloader());

      await act(async () => {
        await result.current.preloadIcons(['01d', '02d']);
      });

      await act(async () => {
        await result.current.preloadIcons(['03d', '04d']);
      });

      expect(result.current.preloadedIcons).toEqual(['01d', '02d', '03d', '04d']);
    });

    it('should not duplicate preloaded icons', async () => {
      mockedWeatherIconService.preloadIcons.mockResolvedValue();

      const { result } = renderHook(() => useWeatherIconPreloader());

      await act(async () => {
        await result.current.preloadIcons(['01d', '02d']);
      });

      await act(async () => {
        await result.current.preloadIcons(['02d', '03d']); // '02d' is duplicate
      });

      expect(result.current.preloadedIcons).toEqual(['01d', '02d', '03d']);
    });
  });
});
