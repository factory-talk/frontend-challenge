import { City } from '@/model/CityModel';
import { WeatherData } from '@/model/WeatherData';
export interface WeatherEntry {
  city: {
    id: number;
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
  main: {
    temp: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
}
export interface CitiesEntry {
  geonameid: string;
  name: string;
  latitude: number;
  longitude: number;
  country_code: string;
  timezone: string;
}
export async function loadCitiesFromFile(): Promise<City[]> {
  try {
    return [];
  } catch (error) {
    console.error('Failed to load cities.json:', error);
    return [];
  }
}
export function convertWeatherEntry(entry: WeatherEntry): City {
  return {
    id: entry.city.id,
    name: entry.city.name,
    state: '',
    country: getCountryName(entry.city.country),
    coord: {
      lon: entry.city.coord.lon,
      lat: entry.city.coord.lat
    }
  };
}
export function convertCitiesEntry(entry: CitiesEntry): City {
  return {
    id: parseInt(entry.geonameid, 10),
    name: entry.name,
    state: '',
    country: getCountryName(entry.country_code),
    coord: {
      lon: entry.longitude,
      lat: entry.latitude
    }
  };
}
export function convertToWeatherData(entry: WeatherEntry): WeatherData {
  return {
    city: convertWeatherEntry(entry),
    time: entry.dt,
    main: {
      temp: entry.main.temp,
      pressure: entry.main.pressure,
      humidity: entry.main.humidity,
      temp_min: entry.main.temp_min,
      temp_max: entry.main.temp_max
    },
    weather: entry.weather.map(w => ({
      id: w.id,
      main: w.main,
      description: w.description,
      icon: w.icon
    })),
    wind: {
      speed: entry.wind.speed,
      deg: entry.wind.deg
    },
    clouds: {
      all: entry.clouds.all
    }
  };
}
function getCountryName(countryCode: string): string {
  const countryMap: { [key: string]: string } = {
    'TH': 'Thailand',
    'US': 'United States',
    'GB': 'United Kingdom',
    'JP': 'Japan',
    'FR': 'France',
    'AU': 'Australia',
    'DE': 'Germany',
    'SG': 'Singapore',
    'CN': 'China',
    'IN': 'India',
    'CA': 'Canada',
    'IT': 'Italy',
    'ES': 'Spain',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'RU': 'Russia',
    'KR': 'South Korea',
    'NL': 'Netherlands',
    'CH': 'Switzerland',
    'SE': 'Sweden',
  };
  return countryMap[countryCode] || countryCode;
}
export function parseCitiesTSV(tsvContent: string): CitiesEntry[] {
  const lines = tsvContent.trim().split('\n');
  const entries: CitiesEntry[] = [];
  for (const line of lines) {
    const fields = line.split('\t');
    if (fields.length >= 19) {
      entries.push({
        geonameid: fields[0],
        name: fields[1],
        latitude: parseFloat(fields[4]),
        longitude: parseFloat(fields[5]),
        country_code: fields[8],
        timezone: fields[17]
      });
    }
  }
  return entries;
}

