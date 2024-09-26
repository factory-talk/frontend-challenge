import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getLocationIqData } from '@/services/public-api/';
import type { LocationData } from '@/services/public-api/';

const mockAxios = new MockAdapter(axios);

describe('getLocationIqData', () => {
  const mockResponse: LocationData[] = [
    {
      place_id: '12345',
      osm_id: '987654',
      osm_type: 'node',
      lat: '51.5074',
      lon: '-0.1278',
      boundingbox: ['51.5072', '51.5076', '-0.1279', '-0.1277'],
      class: 'place',
      type: 'city',
      display_name: 'London, Greater London, England, United Kingdom',
      display_place: 'London',
      display_address: 'Greater London, England, United Kingdom',
      address: {
        name: 'London',
        city: 'London',
        county: 'Greater London',
        state: 'England',
        country: 'United Kingdom',
        country_code: 'gb',
      },
    },
  ];

  beforeEach(() => {
    mockAxios.reset();
  });

  it('fetches location data successfully', async () => {
    const query = 'London';

    // Mock the API response
    mockAxios.onGet('https://api.locationiq.com/v1/autocomplete').reply(200, mockResponse);

    const response = await getLocationIqData(query);

    expect(response.data).toEqual(mockResponse);
    expect(response.status).toBe(200);
  });

  it('handles API errors', async () => {
    const query = 'InvalidLocation';

    // Mock a 404 response from the API
    mockAxios.onGet('https://api.locationiq.com/v1/autocomplete').reply(404, { message: 'Not Found' });

    await expect(getLocationIqData(query)).rejects.toThrow('Request failed with status code 404');
  });
});
