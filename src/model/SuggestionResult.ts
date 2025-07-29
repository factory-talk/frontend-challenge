import { City } from './CityModel';
export interface SuggestionResult {
  cities: City[];
  hasMore: boolean;
  total: number;
}

