import { 
  fahrenheitToCelsius, 
  celsiusToFahrenheit, 
  kelvinToCelsius, 
  kelvinToFahrenheit,
  formatTemperature,
  autoConvertToCelsius,
  calculateRainProbability 
} from '../utils/weatherUtils';

describe('Weather Utils', () => {
  describe('Temperature Conversions', () => {
    test('fahrenheitToCelsius should convert correctly', () => {
      expect(fahrenheitToCelsius(32)).toBe(0);    // Freezing point
      expect(fahrenheitToCelsius(212)).toBe(100); // Boiling point
      expect(fahrenheitToCelsius(68)).toBe(20);   // Room temperature
      expect(fahrenheitToCelsius(86)).toBe(30);   // Warm day
    });

    test('celsiusToFahrenheit should convert correctly', () => {
      expect(celsiusToFahrenheit(0)).toBe(32);    // Freezing point
      expect(celsiusToFahrenheit(100)).toBe(212); // Boiling point
      expect(celsiusToFahrenheit(20)).toBe(68);   // Room temperature
      expect(celsiusToFahrenheit(30)).toBe(86);   // Warm day
    });

    test('kelvinToCelsius should convert correctly', () => {
      expect(kelvinToCelsius(273.15)).toBe(0);    // Freezing point
      expect(kelvinToCelsius(373.15)).toBe(100);  // Boiling point
      expect(kelvinToCelsius(293.15)).toBe(20);   // Room temperature
    });

    test('kelvinToFahrenheit should convert correctly', () => {
      expect(kelvinToFahrenheit(273.15)).toBe(32); // Freezing point
      expect(kelvinToFahrenheit(373.15)).toBe(212); // Boiling point
    });

    test('formatTemperature should format correctly', () => {
      expect(formatTemperature(20, 'C')).toBe('20°C');
      expect(formatTemperature(68, 'F')).toBe('68°F');
      expect(formatTemperature(293, 'K')).toBe('293K');
      expect(formatTemperature(25)).toBe('25°C'); // Default to Celsius
    });

    test('autoConvertToCelsius should detect and convert correctly', () => {
      expect(autoConvertToCelsius(293.15)).toBe(20);  // Kelvin (>200)
      expect(autoConvertToCelsius(68)).toBe(20);      // Fahrenheit (>50)
      expect(autoConvertToCelsius(25)).toBe(25);      // Already Celsius (<50)
    });
  });

  describe('Rain Probability Calculation', () => {
    test('should return high probability for rain conditions', () => {
      expect(calculateRainProbability('Rain', 'moderate rain')).toBe(85);
      expect(calculateRainProbability('Drizzle', 'light drizzle')).toBe(60);
      expect(calculateRainProbability('Thunderstorm', 'thunderstorm')).toBe(90);
    });

    test('should return moderate probability for cloudy conditions', () => {
      expect(calculateRainProbability('Clouds', 'overcast clouds')).toBe(40);
      expect(calculateRainProbability('Clouds', 'scattered clouds')).toBe(25);
      expect(calculateRainProbability('Clouds', 'few clouds')).toBe(10);
    });

    test('should return low probability for clear conditions', () => {
      expect(calculateRainProbability('Clear', 'clear sky')).toBe(5);
    });

    test('should use cloud percentage when available', () => {
      expect(calculateRainProbability('Clouds', 'cloudy', 80)).toBe(32); // 80 * 0.4 = 32
      expect(calculateRainProbability('Clouds', 'cloudy', 50)).toBe(20); // 50 * 0.4 = 20
    });

    test('should handle unknown conditions', () => {
      expect(calculateRainProbability('Mist', 'mist')).toBe(15);
      expect(calculateRainProbability('Unknown', 'unknown')).toBe(15);
    });
  });

  describe('Real-world Temperature Examples', () => {
    test('should handle typical weather API temperatures', () => {
      // OpenWeatherMap typically returns temperatures in Kelvin
      expect(autoConvertToCelsius(288.15)).toBe(15); // 15°C in Kelvin
      expect(autoConvertToCelsius(298.15)).toBe(25); // 25°C in Kelvin
      
      // Some APIs return Fahrenheit
      expect(fahrenheitToCelsius(77)).toBe(25);      // 25°C in Fahrenheit
      expect(fahrenheitToCelsius(59)).toBe(15);      // 15°C in Fahrenheit
      
      // Already in Celsius
      expect(autoConvertToCelsius(25)).toBe(25);
      expect(autoConvertToCelsius(15)).toBe(15);
    });
  });
});
