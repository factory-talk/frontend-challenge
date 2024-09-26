import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/hooks/api/query-key";
import type { GetOpenWeatherDataParams } from "@/services/public-api";
import { getOpenWeatherData } from "@/services/public-api";

// This function fetches weather data based on latitude and longitude
export const useGetOpenWeatherData = ({ lat, lon, unit }: GetOpenWeatherDataParams) => {
  return useQuery({
    queryFn: async () => await getOpenWeatherData({ lat, lon, unit }),
    queryKey: [QUERY_KEY.OPEN_WEATHER, lat, lon], // Include lat and lon in the query key to avoid caching issues
    select: (axiosResponse) => {
      return axiosResponse.data;
    },
  });
};