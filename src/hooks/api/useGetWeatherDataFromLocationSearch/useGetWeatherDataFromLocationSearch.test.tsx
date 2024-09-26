import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetWeatherDataFromLocationSearch } from '@/hooks/api/useGetWeatherDataFromLocationSearch/useGetWeatherDataFromLocationSearch';
import { getLocationIqData, getOpenWeatherData } from '@/services/public-api'; // Mock these services
import type { LocationData, WeatherData } from '@/services/public-api';
import type { TemperatureUnit } from '@/stores/useTemperatureUnitStore';

// Mock services
jest.mock('@/services/public-api', () => ({
  getLocationIqData: jest.fn(),
  getOpenWeatherData: jest.fn(),
}));

// Create a query client
const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetWeatherDataFromLocationSearch', () => {
  const query = 'Test Place';
  const unit: TemperatureUnit = { unit: 'celsius', type: 'metric', label: 'Celsius', symbol: '°C' };

  const mockLocationData: LocationData[] = [
    {
      place_id: '1',
      osm_id: '1',
      osm_type: 'node',
      lat: '35.6895',
      lon: '139.6917',
      boundingbox: ['35.6895', '35.6895', '139.6917', '139.6917'],
      class: 'place',
      type: 'city',
      display_name: 'Test City, Tokyo, Japan',
      display_place: 'Test City',
      display_address: 'Tokyo, Japan',
      address: {
        name: 'Test City',
        state: 'Tokyo',
        country: 'Japan',
        country_code: 'JP',
      },
    },
  ];

  const mockWeatherData: WeatherData = {
    coord: { lon: 139.6917, lat: 35.6895 },
    weather: [{ id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }],
    base: 'stations',
    main: { temp: 25, feels_like: 27, temp_min: 24, temp_max: 26, pressure: 1013, humidity: 60 },
    visibility: 10000,
    wind: { speed: 5.1, deg: 120 },
    clouds: { all: 20 },
    dt: 1620577800,
    sys: { type: 1, id: 8074, country: 'JP', sunrise: 1620545910, sunset: 1620592624 },
    timezone: 32400,
    id: 1850147,
    name: 'Tokyo',
    cod: 200,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock location API response
    (getLocationIqData as jest.Mock).mockResolvedValue({
      data: mockLocationData,
    });

    // Mock weather API response
    (getOpenWeatherData as jest.Mock).mockResolvedValue({
      data: mockWeatherData,
    });
  });

  it('fetches location and weather data successfully', async () => {
    const { result } = renderHook(() => useGetWeatherDataFromLocationSearch(query, unit), {
      wrapper,
    });

    // Wait for the data to be fetched
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that location and weather data are merged correctly
    expect(result.current.data).toEqual([
      {
        location: mockLocationData[0],
        weather: mockWeatherData,
      },
    ]);
  });
});
