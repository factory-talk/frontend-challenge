import axios from "axios";
import { ForecastData, WeatherData } from "../_lib/models";
import { unitToMetric } from "../_lib/temperatureUtil";

export type WeatherSearchParams = {
	lat: string;
	lon: string;
	unit: string;
}

function buildQueryString (params: WeatherSearchParams): string {
	const queryParams = new URLSearchParams();
	queryParams.append('lat', params.lat);
	queryParams.append('lon', params.lon);
	queryParams.append('units', unitToMetric(params.unit));
	return queryParams.toString();
}


export async function getWeatherByCoords (params: WeatherSearchParams): Promise<WeatherData> {
	const url = `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

	try {
		const response = await axios.get(`${url}&${buildQueryString(params)}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching weather data:", error);
		throw error;
	}
}

export async function getForecast (params: WeatherSearchParams): Promise<ForecastData[]> {
	const url = `https://api.openweathermap.org/data/2.5/forecast?appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`;

	try {
		const response = await axios.get(`${url}&${buildQueryString(params)}`);
		return response.data.list;
	} catch (error) {
		console.error("Error fetching forecast data:", error);
		throw error;
	}
}