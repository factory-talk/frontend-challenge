import {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
  kelvinToCelsius,
  kelvinToFahrenheit,
  formatTemperature,
  autoConvertToCelsius,
  calculateRainProbability
} from '@/utils/weatherUtils';

describe('weatherUtils', () => {
  describe('fahrenheitToCelsius', () => {
    it('should convert freezing point correctly', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);
    });

    it('should convert boiling point correctly', () => {
      expect(fahrenheitToCelsius(212)).toBe(100);
    });

    it('should convert room temperature correctly', () => {
      expect(fahrenheitToCelsius(68)).toBe(20);
    });

    it('should handle negative temperatures', () => {
      expect(fahrenheitToCelsius(-40)).toBe(-40);
    });

    it('should round to nearest integer', () => {
      expect(fahrenheitToCelsius(33.8)).toBe(1); // 1.0
      expect(fahrenheitToCelsius(35.6)).toBe(2); // 2.0
    });
  });

  describe('celsiusToFahrenheit', () => {
    it('should convert freezing point correctly', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);
    });

    it('should convert boiling point correctly', () => {
      expect(celsiusToFahrenheit(100)).toBe(212);
    });

    it('should convert room temperature correctly', () => {
      expect(celsiusToFahrenheit(20)).toBe(68);
    });

    it('should handle negative temperatures', () => {
      expect(celsiusToFahrenheit(-40)).toBe(-40);
    });

    it('should round to nearest integer', () => {
      expect(celsiusToFahrenheit(0.5)).toBe(33); // 32.9
      expect(celsiusToFahrenheit(1.5)).toBe(35); // 34.7
    });
  });

  describe('kelvinToCelsius', () => {
    it('should convert absolute zero correctly', () => {
      expect(kelvinToCelsius(0)).toBe(-273);
    });

    it('should convert freezing point correctly', () => {
      expect(kelvinToCelsius(273.15)).toBe(0);
    });

    it('should convert boiling point correctly', () => {
      expect(kelvinToCelsius(373.15)).toBe(100);
    });

    it('should convert room temperature correctly', () => {
      expect(kelvinToCelsius(293.15)).toBe(20);
    });

    it('should round to nearest integer', () => {
      expect(kelvinToCelsius(273.65)).toBe(1); // 0.5
      expect(kelvinToCelsius(274.65)).toBe(2); // 1.5
    });
  });

  describe('kelvinToFahrenheit', () => {
    it('should convert absolute zero correctly', () => {
      expect(kelvinToFahrenheit(0)).toBe(-460);
    });

    it('should convert freezing point correctly', () => {
      expect(kelvinToFahrenheit(273.15)).toBe(32);
    });

    it('should convert boiling point correctly', () => {
      expect(kelvinToFahrenheit(373.15)).toBe(212);
    });

    it('should convert room temperature correctly', () => {
      expect(kelvinToFahrenheit(293.15)).toBe(68);
    });

    it('should round to nearest integer', () => {
      expect(kelvinToFahrenheit(274.15)).toBe(34); // 33.8
      expect(kelvinToFahrenheit(275.15)).toBe(36); // 35.6
    });
  });

  describe('formatTemperature', () => {
    it('should format Celsius by default', () => {
      expect(formatTemperature(25)).toBe('25°C');
      expect(formatTemperature(0)).toBe('0°C');
      expect(formatTemperature(-10)).toBe('-10°C');
    });

    it('should format Celsius when specified', () => {
      expect(formatTemperature(25, 'C')).toBe('25°C');
    });

    it('should format Fahrenheit when specified', () => {
      expect(formatTemperature(77, 'F')).toBe('77°F');
    });

    it('should format Kelvin when specified', () => {
      expect(formatTemperature(298, 'K')).toBe('298K');
    });

    it('should round temperatures', () => {
      expect(formatTemperature(25.7)).toBe('26°C');
      expect(formatTemperature(25.3)).toBe('25°C');
    });
  });

  describe('autoConvertToCelsius', () => {
    it('should convert Kelvin values (> 200)', () => {
      expect(autoConvertToCelsius(273.15)).toBe(0); // Kelvin to Celsius
      expect(autoConvertToCelsius(298.15)).toBe(25);
    });

    it('should convert Fahrenheit values (> 50)', () => {
      expect(autoConvertToCelsius(68)).toBe(20); // Fahrenheit to Celsius
      expect(autoConvertToCelsius(86)).toBe(30);
    });

    it('should keep Celsius values unchanged (≤ 50)', () => {
      expect(autoConvertToCelsius(25)).toBe(25);
      expect(autoConvertToCelsius(0)).toBe(0);
      expect(autoConvertToCelsius(-10)).toBe(-10);
      expect(autoConvertToCelsius(50)).toBe(50); // Edge case: 50°C stays as-is
    });

    it('should round to nearest integer', () => {
      expect(autoConvertToCelsius(25.7)).toBe(26);
      expect(autoConvertToCelsius(25.3)).toBe(25);
    });
  });

  describe('calculateRainProbability', () => {
    describe('High probability conditions', () => {
      it('should return 85% for rain conditions', () => {
        expect(calculateRainProbability('Rain', 'light rain')).toBe(85);
        expect(calculateRainProbability('Heavy Rain', 'heavy rain')).toBe(85);
        expect(calculateRainProbability('Clear', 'light rain')).toBe(85);
      });

      it('should return 60% for drizzle conditions', () => {
        expect(calculateRainProbability('Drizzle', 'light drizzle')).toBe(60);
        expect(calculateRainProbability('Clear', 'drizzle')).toBe(60);
      });

      it('should return 90% for thunderstorm conditions', () => {
        expect(calculateRainProbability('Thunderstorm', 'heavy thunderstorm')).toBe(90);
        expect(calculateRainProbability('Clear', 'thunder')).toBe(90);
      });
    });

    describe('Cloud-based probability', () => {
      it('should return 40% for overcast conditions', () => {
        expect(calculateRainProbability('Clouds', 'overcast clouds')).toBe(40);
        expect(calculateRainProbability('Clouds', 'broken clouds')).toBe(40);
      });

      it('should return 25% for scattered clouds', () => {
        expect(calculateRainProbability('Clouds', 'scattered clouds')).toBe(25);
      });

      it('should return 10% for few clouds', () => {
        expect(calculateRainProbability('Clouds', 'few clouds')).toBe(10);
      });

      it('should use cloud percentage when available', () => {
        expect(calculateRainProbability('Clouds', 'clouds', 75)).toBe(30); // 75 * 0.4 = 30
        expect(calculateRainProbability('Clouds', 'clouds', 50)).toBe(20); // 50 * 0.4 = 20
        expect(calculateRainProbability('Clouds', 'clouds', 0)).toBe(0);
      });

      it('should default to 30% for general cloud conditions', () => {
        expect(calculateRainProbability('Clouds', 'some clouds')).toBe(30);
      });
    });

    describe('Clear conditions', () => {
      it('should return 5% for clear conditions', () => {
        expect(calculateRainProbability('Clear', 'clear sky')).toBe(5);
        expect(calculateRainProbability('Clear Sky', 'clear')).toBe(5);
      });
    });

    describe('Other conditions', () => {
      it('should return 15% for other conditions', () => {
        expect(calculateRainProbability('Mist', 'mist')).toBe(15);
        expect(calculateRainProbability('Fog', 'fog')).toBe(15);
        expect(calculateRainProbability('Snow', 'snow')).toBe(15);
        expect(calculateRainProbability('Unknown', 'unknown condition')).toBe(15);
      });
    });

    describe('Case insensitive handling', () => {
      it('should handle uppercase inputs', () => {
        expect(calculateRainProbability('RAIN', 'HEAVY RAIN')).toBe(85);
        expect(calculateRainProbability('CLOUDS', 'OVERCAST')).toBe(40);
        expect(calculateRainProbability('CLEAR', 'CLEAR SKY')).toBe(5);
      });

      it('should handle mixed case inputs', () => {
        expect(calculateRainProbability('Rain', 'Light Rain')).toBe(85);
        expect(calculateRainProbability('Clouds', 'Scattered Clouds')).toBe(25);
      });
    });
  });
});
