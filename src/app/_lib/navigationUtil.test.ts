import { computeCityWeatherURL, CityWeatherURLParams } from './navigationUtil';

describe('computeCityWeatherURL', () => {
	test('should compute the correct URL with valid parameters', () => {
		const params: CityWeatherURLParams = {
			id: '123',
			lat: '13.7563',
			lon: '100.5018',
			unit: 'metric',
			country: 'TH'
		};
		const expectedURL = '/city/123?lat=13.7563&lon=100.5018&unit=metric&country=TH';
		expect(computeCityWeatherURL(params)).toBe(expectedURL);
	});

	test('should throw an error if any parameter is missing', () => {
		const incompleteParams: Partial<CityWeatherURLParams> = {
			id: '123',
			lat: '13.7563',
			lon: '100.5018',
			unit: 'metric'
			// country is missing
		};
		expect(() => computeCityWeatherURL(incompleteParams as CityWeatherURLParams)).toThrow('All parameters must be provided and not empty');
	});

	test('should throw an error if any parameter is an empty string', () => {
		const emptyParams: CityWeatherURLParams = {
			id: '',
			lat: '',
			lon: '',
			unit: '',
			country: ''
		};
		expect(() => computeCityWeatherURL(emptyParams)).toThrow('All parameters must be provided and not empty');
	});
});