import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/libs/react-query/hooks/query-key";
import { getOpenWeatherData, getLocationIqData } from "@/libs/react-query/services/public-api";

export const useGetWeatherDataFromLocationSearch = (query: string) => {
  return useQuery({
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
