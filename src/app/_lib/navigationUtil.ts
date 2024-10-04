import { City } from "./models";

export type CityWeatherURLParams = {
	id: string;
	lat: string;
	lon: string;
	unit: string;
	country: string;
}

export const computeCityWeatherURL = (params: CityWeatherURLParams) => {
	if (!params.id || !params.lat || !params.lon || !params.unit || !params.country) {
		throw new Error('All parameters must be provided and not empty');
	}
	return `/city/${params.id}?lat=${params.lat}&lon=${params.lon}&unit=${params.unit}&country=${params.country}`;
}