import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getCitiesByName, getCitiesByZip, getCountries } from './apiPlace';
import { City, Country } from '../_lib/models';

const mock = new MockAdapter(axios);

describe('apiPlace service', () => {
	afterEach(() => {
		mock.reset();
	});

	test('getCitiesByName should return cities', async () => {
		const mockData = { features: [{ id: '1', place_name: 'City1' }] };
		mock.onGet(/mapbox.places/).reply(200, mockData);

		const cities: City[] = await getCitiesByName('City1');
		expect(cities).toEqual(mockData.features);
	});

	test('getCitiesByZip should return cities', async () => {
		const mockData = { features: [{ id: '1', place_name: 'City1' }] };
		mock.onGet(/mapbox.places/).reply(200, mockData);

		const cities: City[] = await getCitiesByZip('12345', 'US');
		expect(cities).toEqual(mockData.features);
	});

	test('getCountries should return countries', async () => {
		const mockData = [{ name: { common: 'Country1' }, cca2: 'C1' }];
		mock.onGet(/restcountries/).reply(200, mockData);

		const countries: Country[] = await getCountries();
		expect(countries).toEqual(mockData);
	});
});