import {
  WeatherIconService,
  WeatherCondition,
  WeatherIconCode,
  WeatherIcon,
  WeatherIconInfo
} from '@/service/weatherIconService';

// Mock Image constructor for preloading tests
Object.defineProperty(global, 'Image', {
  writable: true,
  value: class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src: string = '';

    constructor() {
      // Simulate image loading
      setTimeout(() => {
        if (this.onload) {
          this.onload();
        }
      }, 0);
    }
  }
});

describe('WeatherIconService', () => {
  describe('getIconUrl', () => {
    it('should generate correct icon URL', () => {
      const iconCode = '01d';
      const url = WeatherIconService.getIconUrl(iconCode);
      expect(url).toBe('https://openweathermap.org/img/wn/01d@2x.png');
    });

    it('should handle different icon codes', () => {
      expect(WeatherIconService.getIconUrl('02n')).toBe('https://openweathermap.org/img/wn/02n@2x.png');
      expect(WeatherIconService.getIconUrl('10d')).toBe('https://openweathermap.org/img/wn/10d@2x.png');
    });
  });

  describe('getWeatherIcon', () => {
    it('should return correct weather icon for day', () => {
      const icon = WeatherIconService.getWeatherIcon('01', true);
      expect(icon).toEqual({
        id: '01d',
        description: 'clear sky',
        isDayIcon: true,
        url: 'https://openweathermap.org/img/wn/01d@2x.png',
        condition: WeatherCondition.CLEAR_SKY
      });
    });

    it('should return correct weather icon for night', () => {
      const icon = WeatherIconService.getWeatherIcon('01', false);
      expect(icon).toEqual({
        id: '01n',
        description: 'clear sky',
        isDayIcon: false,
        url: 'https://openweathermap.org/img/wn/01n@2x.png',
        condition: WeatherCondition.CLEAR_SKY
      });
    });

    it('should return null for unknown weather ID', () => {
      const icon = WeatherIconService.getWeatherIcon('99', true);
      expect(icon).toBeNull();
    });

    it('should log warning for unknown weather ID', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      WeatherIconService.getWeatherIcon('99', true);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown weather ID: 99');
      consoleSpy.mockRestore();
    });

    it('should default to day icon when isDay parameter is not provided', () => {
      const icon = WeatherIconService.getWeatherIcon('02');
      expect(icon?.isDayIcon).toBe(true);
      expect(icon?.id).toBe('02d');
    });
  });

  describe('getIconByCondition', () => {
    it('should return correct icon for condition enum', () => {
      const icon = WeatherIconService.getIconByCondition(WeatherCondition.RAIN, true);
      expect(icon).toEqual({
        id: '10d',
        description: 'rain',
        isDayIcon: true,
        url: 'https://openweathermap.org/img/wn/10d@2x.png',
        condition: WeatherCondition.RAIN
      });
    });

    it('should return correct icon for condition string', () => {
      const icon = WeatherIconService.getIconByCondition('rain', false);
      expect(icon?.id).toBe('10n');
      expect(icon?.isDayIcon).toBe(false);
    });

    it('should return null for unknown condition', () => {
      const icon = WeatherIconService.getIconByCondition('unknown' as WeatherCondition, true);
      expect(icon).toBeNull();
    });

    it('should log warning for unknown condition', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      WeatherIconService.getIconByCondition('unknown' as WeatherCondition, true);
      expect(consoleSpy).toHaveBeenCalledWith('Unknown weather condition: unknown');
      consoleSpy.mockRestore();
    });
  });

  describe('getIconByCode', () => {
    it('should return correct icon for full icon code', () => {
      const icon = WeatherIconService.getIconByCode('10d');
      expect(icon).toEqual({
        id: '10d',
        description: 'rain',
        isDayIcon: true,
        url: 'https://openweathermap.org/img/wn/10d@2x.png',
        condition: WeatherCondition.RAIN
      });
    });

    it('should return correct icon for night code', () => {
      const icon = WeatherIconService.getIconByCode('10n');
      expect(icon?.isDayIcon).toBe(false);
      expect(icon?.id).toBe('10n');
    });

    it('should return null for invalid icon code', () => {
      expect(WeatherIconService.getIconByCode('')).toBeNull();
      expect(WeatherIconService.getIconByCode('1')).toBeNull();
      expect(WeatherIconService.getIconByCode('12')).toBeNull();
    });

    it('should log warning for invalid icon code', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      WeatherIconService.getIconByCode('invalid');
      expect(consoleSpy).toHaveBeenCalledWith('Unknown weather ID: in');
      consoleSpy.mockRestore();
    });
  });

  describe('preloadIcon', () => {
    it('should resolve when image loads successfully', async () => {
      await expect(WeatherIconService.preloadIcon('01d')).resolves.toBeUndefined();
    });

    it('should reject when image fails to load', async () => {
      // Mock Image to simulate error
      const OriginalImage = global.Image;
      global.Image = class MockImageError {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror();
            }
          }, 0);
        }
      } as any;

      await expect(WeatherIconService.preloadIcon('01d')).rejects.toThrow('Failed to load icon: 01d');

      // Restore original Image
      global.Image = OriginalImage;
    });
  });

  describe('preloadIcons', () => {
    it('should preload multiple icons successfully', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await WeatherIconService.preloadIcons(['01d', '02d', '03d']);
      expect(consoleSpy).toHaveBeenCalledWith('Successfully preloaded 3 weather icons');
      consoleSpy.mockRestore();
    });

    it('should handle errors when preloading fails', async () => {
      // Mock Image to simulate error
      const OriginalImage = global.Image;
      global.Image = class MockImageError {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        src: string = '';

        constructor() {
          setTimeout(() => {
            if (this.onerror) {
              this.onerror();
            }
          }, 0);
        }
      } as any;

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      await WeatherIconService.preloadIcons(['01d', '02d']);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to preload some weather icons:', expect.any(Error));
      
      consoleSpy.mockRestore();
      global.Image = OriginalImage;
    });
  });

  describe('getAllConditions', () => {
    it('should return all weather condition enum values', () => {
      const conditions = WeatherIconService.getAllConditions();
      expect(conditions).toEqual([
        'clearSky',
        'fewClouds',
        'scatteredClouds',
        'brokenClouds',
        'showerRain',
        'rain',
        'thunderstorm',
        'snow',
        'mist'
      ]);
    });
  });

  describe('getAllIconCodes', () => {
    it('should return all weather icon code enum values', () => {
      const iconCodes = WeatherIconService.getAllIconCodes();
      expect(iconCodes).toContain('01d');
      expect(iconCodes).toContain('01n');
      expect(iconCodes).toContain('10d');
      expect(iconCodes).toContain('10n');
      expect(iconCodes.length).toBe(18); // 9 conditions × 2 (day/night)
    });
  });

  describe('getConditionByCode', () => {
    it('should return correct condition for icon code', () => {
      expect(WeatherIconService.getConditionByCode('01d')).toBe(WeatherCondition.CLEAR_SKY);
      expect(WeatherIconService.getConditionByCode('10n')).toBe(WeatherCondition.RAIN);
      expect(WeatherIconService.getConditionByCode('11d')).toBe(WeatherCondition.THUNDERSTORM);
    });

    it('should return null for invalid icon code', () => {
      expect(WeatherIconService.getConditionByCode('invalid')).toBeNull();
    });
  });

  describe('getAllIcons', () => {
    it('should return all weather icon information', () => {
      const icons = WeatherIconService.getAllIcons();
      expect(icons.length).toBe(9); // 9 different weather conditions
      expect(icons[0]).toHaveProperty('dayIcon');
      expect(icons[0]).toHaveProperty('nightIcon');
      expect(icons[0]).toHaveProperty('description');
      expect(icons[0]).toHaveProperty('condition');
    });
  });

  describe('getDescription', () => {
    it('should return correct description for icon code', () => {
      expect(WeatherIconService.getDescription('01d')).toBe('clear sky');
      expect(WeatherIconService.getDescription('10n')).toBe('rain');
      expect(WeatherIconService.getDescription('11d')).toBe('thunderstorm');
    });

    it('should return default description for invalid icon code', () => {
      expect(WeatherIconService.getDescription('invalid')).toBe('Unknown weather condition');
    });
  });

  describe('isDayIcon', () => {
    it('should return true for day icons', () => {
      expect(WeatherIconService.isDayIcon('01d')).toBe(true);
      expect(WeatherIconService.isDayIcon('10d')).toBe(true);
    });

    it('should return false for night icons', () => {
      expect(WeatherIconService.isDayIcon('01n')).toBe(false);
      expect(WeatherIconService.isDayIcon('10n')).toBe(false);
    });
  });

  describe('isNightIcon', () => {
    it('should return true for night icons', () => {
      expect(WeatherIconService.isNightIcon('01n')).toBe(true);
      expect(WeatherIconService.isNightIcon('10n')).toBe(true);
    });

    it('should return false for day icons', () => {
      expect(WeatherIconService.isNightIcon('01d')).toBe(false);
      expect(WeatherIconService.isNightIcon('10d')).toBe(false);
    });
  });

  describe('getOppositeTimeIcon', () => {
    it('should return night icon for day icon', () => {
      expect(WeatherIconService.getOppositeTimeIcon('01d')).toBe('01n');
      expect(WeatherIconService.getOppositeTimeIcon('10d')).toBe('10n');
    });

    it('should return day icon for night icon', () => {
      expect(WeatherIconService.getOppositeTimeIcon('01n')).toBe('01d');
      expect(WeatherIconService.getOppositeTimeIcon('10n')).toBe('10d');
    });

    it('should return null for invalid icon code', () => {
      expect(WeatherIconService.getOppositeTimeIcon('')).toBeNull();
      expect(WeatherIconService.getOppositeTimeIcon('1')).toBeNull();
      expect(WeatherIconService.getOppositeTimeIcon('99d')).toBeNull();
    });
  });

  describe('preloadCommonIcons', () => {
    it('should preload common weather icons', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await WeatherIconService.preloadCommonIcons();
      expect(consoleSpy).toHaveBeenCalledWith('Successfully preloaded 10 weather icons');
      consoleSpy.mockRestore();
    });
  });
});
