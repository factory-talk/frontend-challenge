import type { AxiosResponse } from 'axios';
import axios from 'axios';

export type LocationData = {
  place_id: string;
  osm_id: string;
  osm_type: string;
  lat: string;
  lon: string;
  boundingbox: string[];
  class: string;
  type: string;
  display_name: string;
  display_place: string;
  display_address: string;
  address: {
    name: string;
    suburb?: string;
    city?: string;
    county?: string;
    state: string;
    postcode?: string;
    country: string;
    country_code: string;
  };
};

export async function getLocationIqData(query: string): Promise<AxiosResponse<LocationData[]>> {
  const apiUrl = 'https://api.locationiq.com/v1/autocomplete';

  // DEFAULT: FREE PLAN API KEY
  const apiKey = process.env.LOCATION_IQ_API_KEY || 'pk.f3f7ce60e9e49234360e96bba791fc2c';

  return axios({
    method: 'GET',
    url: apiUrl,
    params: {
      key: apiKey,
      q: query,
      limit: 5,
      dedupe: 1,
    },
  });
}
