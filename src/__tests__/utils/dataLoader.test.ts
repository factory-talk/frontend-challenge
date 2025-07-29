import {
  convertWeatherEntry,
  convertCitiesEntry,
  convertToWeatherData,
  parseCitiesTSV,
  WeatherEntry,
  CitiesEntry
} from '@/utils/dataLoader';

describe('dataLoader utils', () => {
  describe('convertWeatherEntry', () => {
    it('should convert WeatherEntry to City model', () => {
      const entry: WeatherEntry = {
        city: {
          id: 1609350,
          name: 'Bangkok',
          country: 'TH',
          coord: {
            lat: 13.75,
            lon: 100.5167
          }
        },
        main: {
          temp: 298.15,
          pressure: 1013,
          humidity: 78,
          temp_min: 295.15,
          temp_max: 301.15
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: 2.57,
          deg: 250
        },
        clouds: {
          all: 0
        },
        dt: 1642694400
      };

      const result = convertWeatherEntry(entry);

      expect(result).toEqual({
        id: 1609350,
        name: 'Bangkok',
        state: '',
        country: 'Thailand',
        coord: {
          lon: 100.5167,
          lat: 13.75
        }
      });
    });

    it('should handle unknown country codes', () => {
      const entry: WeatherEntry = {
        city: {
          id: 1,
          name: 'Test City',
          country: 'XX',
          coord: { lat: 0, lon: 0 }
        },
        main: {
          temp: 298.15,
          pressure: 1013,
          humidity: 78,
          temp_min: 295.15,
          temp_max: 301.15
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: { speed: 2.57, deg: 250 },
        clouds: { all: 0 },
        dt: 1642694400
      };

      const result = convertWeatherEntry(entry);
      expect(result.country).toBe('XX'); // Should return the original code
    });
  });

  describe('convertCitiesEntry', () => {
    it('should convert CitiesEntry to City model', () => {
      const entry: CitiesEntry = {
        geonameid: '1609350',
        name: 'Bangkok',
        latitude: 13.75,
        longitude: 100.5167,
        country_code: 'TH',
        timezone: 'Asia/Bangkok'
      };

      const result = convertCitiesEntry(entry);

      expect(result).toEqual({
        id: 1609350,
        name: 'Bangkok',
        state: '',
        country: 'Thailand',
        coord: {
          lon: 100.5167,
          lat: 13.75
        }
      });
    });

    it('should handle invalid geonameid', () => {
      const entry: CitiesEntry = {
        geonameid: 'invalid',
        name: 'Test City',
        latitude: 0,
        longitude: 0,
        country_code: 'XX',
        timezone: 'UTC'
      };

      const result = convertCitiesEntry(entry);
      expect(result.id).toBeNaN();
    });
  });

  describe('convertToWeatherData', () => {
    it('should convert WeatherEntry to WeatherData model', () => {
      const entry: WeatherEntry = {
        city: {
          id: 1609350,
          name: 'Bangkok',
          country: 'TH',
          coord: {
            lat: 13.75,
            lon: 100.5167
          }
        },
        main: {
          temp: 298.15,
          pressure: 1013,
          humidity: 78,
          temp_min: 295.15,
          temp_max: 301.15
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: 2.57,
          deg: 250
        },
        clouds: {
          all: 0
        },
        dt: 1642694400
      };

      const result = convertToWeatherData(entry);

      expect(result).toEqual({
        city: {
          id: 1609350,
          name: 'Bangkok',
          state: '',
          country: 'Thailand',
          coord: {
            lon: 100.5167,
            lat: 13.75
          }
        },
        time: 1642694400,
        main: {
          temp: 298.15,
          pressure: 1013,
          humidity: 78,
          temp_min: 295.15,
          temp_max: 301.15
        },
        weather: [{
          id: 800,
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: 2.57,
          deg: 250
        },
        clouds: {
          all: 0
        }
      });
    });

    it('should handle multiple weather conditions', () => {
      const entry: WeatherEntry = {
        city: {
          id: 1,
          name: 'Test City',
          country: 'TH',
          coord: { lat: 0, lon: 0 }
        },
        main: {
          temp: 298.15,
          pressure: 1013,
          humidity: 78,
          temp_min: 295.15,
          temp_max: 301.15
        },
        weather: [
          {
            id: 500,
            main: 'Rain',
            description: 'light rain',
            icon: '10d'
          },
          {
            id: 800,
            main: 'Clear',
            description: 'clear sky',
            icon: '01d'
          }
        ],
        wind: { speed: 2.57, deg: 250 },
        clouds: { all: 20 },
        dt: 1642694400
      };

      const result = convertToWeatherData(entry);
      expect(result.weather).toHaveLength(2);
      expect(result.weather[0].main).toBe('Rain');
      expect(result.weather[1].main).toBe('Clear');
    });
  });

  describe('parseCitiesTSV', () => {
    it('should parse TSV content correctly', () => {
      const tsvContent = `1609350\tBangkok\tBangkok\tBangkok\t13.75\t100.5167\tP\tPPLA\tTH\t\t10\t\t\t\t5696900\t\t1\tAsia/Bangkok\t2021-08-06
1234567\tTest City\tTest City\tTest City\t0\t0\tP\tPPL\tUS\t\t\t\t\t\t100000\t\t0\tAmerica/New_York\t2021-08-06`;

      const result = parseCitiesTSV(tsvContent);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        geonameid: '1609350',
        name: 'Bangkok',
        latitude: 13.75,
        longitude: 100.5167,
        country_code: 'TH',
        timezone: 'Asia/Bangkok'
      });
      expect(result[1]).toEqual({
        geonameid: '1234567',
        name: 'Test City',
        latitude: 0,
        longitude: 0,
        country_code: 'US',
        timezone: 'America/New_York'
      });
    });

    it('should handle empty TSV content', () => {
      const result = parseCitiesTSV('');
      expect(result).toEqual([]);
    });

    it('should handle malformed TSV lines', () => {
      const tsvContent = `1609350\tBangkok\tBangkok\tBangkok\t13.75\t100.5167\tP\tPPLA\tTH\t\t10\t\t\t\t5696900\t\t1\tAsia/Bangkok\t2021-08-06
invalid line with not enough fields`;

      const result = parseCitiesTSV(tsvContent);
      expect(result).toHaveLength(1); // Only the valid line should be parsed
      expect(result[0].name).toBe('Bangkok');
    });

    it('should handle invalid coordinates', () => {
      const tsvContent = `1609350\tTest City\tTest City\tTest City\tinvalid\tinvalid\tP\tPPLA\tTH\t\t10\t\t\t\t5696900\t\t1\tAsia/Bangkok\t2021-08-06`;

      const result = parseCitiesTSV(tsvContent);
      expect(result).toHaveLength(1);
      expect(result[0].latitude).toBeNaN();
      expect(result[0].longitude).toBeNaN();
    });

    it('should handle whitespace in TSV content', () => {
      const tsvContent = `  
1609350\tBangkok\tBangkok\tBangkok\t13.75\t100.5167\tP\tPPLA\tTH\t\t10\t\t\t\t5696900\t\t1\tAsia/Bangkok\t2021-08-06
  `;

      const result = parseCitiesTSV(tsvContent);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Bangkok');
    });
  });
});
