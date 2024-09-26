import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import type { WeatherData, GetOpenWeatherDataParams } from '@/services/public-api';
import { getOpenWeatherData } from '@/services/public-api';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';

const mockAxios = new MockAdapter(axios);

describe('getOpenWeatherData', () => {
  const lat = '35.6895'; // Example latitude for Tokyo
  const lon = '139.6917'; // Example longitude for Tokyo
  const unit: TemperatureUnit = { unit: 'kelvin', type: 'standard', label: 'Kelvin', symbol: 'K' }; // Example unit

  const mockResponse: WeatherData = {
    coord: { lon: 139.6917, lat: 35.6895 },
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    base: 'stations',
    main: {
      temp: 25,
      feels_like: 27,
      temp_min: 24,
      temp_max: 26,
      pressure: 1013,
      humidity: 60,
      sea_level: 1013,
      grnd_level: 1009,
    },
    visibility: 10000,
    wind: { speed: 5.1, deg: 120, gust: 6.5 },
    clouds: { all: 20 },
    dt: 1620577800,
    sys: {
      type: 1,
      id: 8074,
      country: 'JP',
      sunrise: 1620545910,
      sunset: 1620592624,
    },
    timezone: 32400,
    id: 1850147,
    name: 'Tokyo',
    cod: 200,
  };

  beforeEach(() => {
    // Reset any request handlers that are declared as a part of tests
    mockAxios.reset();
  });

  it('fetches weather data successfully', async () => {
    mockAxios.onGet(/api.openweathermap.org/).reply(200, mockResponse);

    const params: GetOpenWeatherDataParams = { lat, lon, unit };
    const response = await getOpenWeatherData(params);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('handles API errors', async () => {
    mockAxios.onGet(/api.openweathermap.org/).reply(404, { message: 'Not Found' });

    const params: GetOpenWeatherDataParams = { lat, lon, unit };

    await expect(getOpenWeatherData(params)).rejects.toThrow('Request failed with status code 404');
  });
});
