import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { useGetOpenWeatherData } from '@/hooks/api/useGetOpenWeatherData/useGetOpenWeatherData'; // Adjust the path if necessary
import type { GetOpenWeatherDataParams, WeatherData } from '@/services/public-api';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';

const mockAxios = new MockAdapter(axios);

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetOpenWeatherData', () => {
  const lat = '35.6895';
  const lon = '139.6917';
  const unit: TemperatureUnit = { unit: 'kelvin', type: 'standard', label: 'Kelvin', symbol: 'K' };

  const mockWeatherData: WeatherData = {
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
    },
    visibility: 10000,
    wind: { speed: 5.1, deg: 120 },
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
    mockAxios.reset();
  });

  it('fetches weather data successfully', async () => {
    // Mock the API response
    mockAxios
      .onGet('https://api.openweathermap.org/data/2.5/weather')
      .reply(200, mockWeatherData);

    const params: GetOpenWeatherDataParams = { lat, lon, unit };

    const { result } = renderHook(() => useGetOpenWeatherData(params), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockWeatherData);
  });
});
