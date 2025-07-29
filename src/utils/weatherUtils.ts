export const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round((fahrenheit - 32) * 5 / 9);
};
export const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9 / 5) + 32);
};
export const kelvinToCelsius = (kelvin: number): number => {
  return Math.round(kelvin - 273.15);
};
export const kelvinToFahrenheit = (kelvin: number): number => {
  return Math.round((kelvin - 273.15) * 9 / 5 + 32);
};
export const formatTemperature = (temp: number, unit: 'C' | 'F' | 'K' = 'C'): string => {
  const units = {
    C: '°C',
    F: '°F',
    K: 'K'
  };
  return `${Math.round(temp)}${units[unit]}`;
};
export const autoConvertToCelsius = (temp: number): number => {
  if (temp > 200) {
    return kelvinToCelsius(temp);
  }
  else if (temp > 50) {
    return fahrenheitToCelsius(temp);
  }
  else {
    return Math.round(temp);
  }
};
export const calculateRainProbability = (
  weatherMain: string, 
  weatherDesc: string, 
  cloudsPercentage?: number
): number => {
  const main = weatherMain.toLowerCase();
  const desc = weatherDesc.toLowerCase();
  if (main.includes('rain') || desc.includes('rain')) {
    return 85;
  }
  if (main.includes('drizzle') || desc.includes('drizzle')) {
    return 60;
  }
  if (main.includes('thunderstorm') || desc.includes('thunder')) {
    return 90;
  }
  if (main.includes('cloud')) {
    if (desc.includes('overcast') || desc.includes('broken')) {
      return 40;
    }
    if (desc.includes('scattered')) {
      return 25;
    }
    if (desc.includes('few')) {
      return 10;
    }
    if (cloudsPercentage !== undefined) {
      return Math.round(cloudsPercentage * 0.4);
    }
    return 30;
  }
  if (main.includes('clear') || desc.includes('clear')) {
    return 5;
  }
  return 15;
};

