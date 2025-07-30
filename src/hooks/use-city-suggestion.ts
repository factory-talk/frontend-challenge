import { SearchCityResponse } from "@/app/api/search-city/route";
import { useEffect, useState } from "react";
import { searchCityApi } from "src/services/get-current-weather";

export function useCitySuggestions(query: string) {
  const [results, setResults] = useState<SearchCityResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    // debounce cause no lib
    const delay = setTimeout(async () => {
      setLoading(true);
      const { data, success } = await searchCityApi(query);
      if (success) setResults(data);
      setLoading(false);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return { results, loading };
}
