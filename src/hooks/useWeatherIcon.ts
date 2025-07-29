import { useState, useEffect } from 'react';
import { WeatherIconService, WeatherIcon } from '@/service/weatherIconService';
interface UseWeatherIconOptions {
  preload?: boolean;
  fallbackIcon?: string;
}
interface UseWeatherIconReturn {
  icon: WeatherIcon | null;
  isLoading: boolean;
  error: string | null;
  preloadIcon: (iconCode: string) => Promise<void>;
}
export function useWeatherIcon(
  iconCode: string | null,
  options: UseWeatherIconOptions = {}
): UseWeatherIconReturn {
  const { preload = false, fallbackIcon = '01d' } = options;
  const [icon, setIcon] = useState<WeatherIcon | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!iconCode) {
      setIcon(null);
      setError(null);
      return;
    }
    const loadIcon = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const weatherIcon = WeatherIconService.getIconByCode(iconCode);
        if (!weatherIcon) {
          throw new Error(`Invalid icon code: ${iconCode}`);
        }
        setIcon(weatherIcon);
        if (preload) {
          try {
            await WeatherIconService.preloadIcon(iconCode);
          } catch (preloadErr) {
            const errorMessage = preloadErr instanceof Error ? preloadErr.message : 'Preload failed';
            setError(errorMessage);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load weather icon';
        setError(errorMessage);
        if (fallbackIcon && iconCode !== fallbackIcon) {
          try {
            const fallbackWeatherIcon = WeatherIconService.getIconByCode(fallbackIcon);
            if (fallbackWeatherIcon) {
              setIcon(fallbackWeatherIcon);
            }
          } catch (fallbackErr) {
            console.error('Failed to load fallback icon:', fallbackErr);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadIcon();
  }, [iconCode, preload, fallbackIcon]);
  const preloadIcon = async (code: string): Promise<void> => {
    try {
      await WeatherIconService.preloadIcon(code);
    } catch (err) {
      console.error('Failed to preload icon:', err);
    }
  };
  return {
    icon,
    isLoading,
    error,
    preloadIcon
  };
}
export function useWeatherIconPreloader() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadedIcons, setPreloadedIcons] = useState<Set<string>>(new Set());
  const preloadIcons = async (iconCodes: string[]): Promise<void> => {
    setIsPreloading(true);
    try {
      await WeatherIconService.preloadIcons(iconCodes);
      setPreloadedIcons(prev => {
        const newSet = new Set(prev);
        iconCodes.forEach(code => newSet.add(code));
        return newSet;
      });
    } catch (error) {
      console.error('Failed to preload weather icons:', error);
    } finally {
      setIsPreloading(false);
    }
  };
  const preloadCommonIcons = async (): Promise<void> => {
    await WeatherIconService.preloadCommonIcons();
  };
  const isIconPreloaded = (iconCode: string): boolean => {
    return preloadedIcons.has(iconCode);
  };
  return {
    isPreloading,
    preloadIcons,
    preloadCommonIcons,
    isIconPreloaded,
    preloadedIcons: Array.from(preloadedIcons)
  };
}

