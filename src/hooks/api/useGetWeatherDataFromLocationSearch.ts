import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/hooks/api/query-key";
import type { LocationData, WeatherData } from "@/services/public-api";
import { getOpenWeatherData, getLocationIqData } from "@/services/public-api";

export type GetWeatherDataFromLocationSearch = {
  location: LocationData;
  weather: WeatherData;
};

export const useGetWeatherDataFromLocationSearch = (query: string) => {
  return useQuery<GetWeatherDataFromLocationSearch[]>({
    queryFn: async () => {
      // Fetch location data from LocationIQ
      const locationResponse = await getLocationIqData(query);
      const locations = locationResponse.data;

      // Create an array of promises to fetch weather data for each location
      const weatherPromises = locations.map(async (location) => {
        const { lat, lon } = location;
        const weatherResponse = await getOpenWeatherData({ lat, lon });

        // Return merged data for each location
        return {
          location,
          weather: weatherResponse.data,
        };
      });

      // Resolve all promises and return the combined data
      return Promise.all(weatherPromises);
    },
    queryKey: [QUERY_KEY.LOCATION_IQ, query], // Include the query in the query key
    select: (data) => data, // Return the combined data as is
  });
};
