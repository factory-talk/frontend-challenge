import axios from "axios";
import { getWeatherByCoords, getForecast, WeatherSearchParams } from "./apiWeather";
import { WeatherData, ForecastData } from "../_lib/models";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("apiWeather service", () => {
	const params: WeatherSearchParams = {
		lat: "35.6895",
		lon: "139.6917",
		unit: "metric"
	};

	describe("getWeatherByCoords", () => {
		it("should fetch weather data by coordinates", async () => {
			const mockWeatherData: WeatherData = {
				coord: { lon: 139.6917, lat: 35.6895 },
				weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
				main: { temp: 25.32, feels_like: 24.85, temp_min: 24.0, temp_max: 26.0, pressure: 1013, humidity: 53 },
				visibility: 10000,
				wind: { speed: 3.6, deg: 90 },
				clouds: { all: 0 },
				dt: 1595243443,
				timezone: 32400,
				id: 1850147,
				name: "Tokyo",
				cod: 200,
				rain: { '1h': 0 },
				snow: { '1h': 0 },
				forecasts: []
			};
			mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

			const result = await getWeatherByCoords(params);
			expect(result).toEqual(mockWeatherData);
		});
	});

	describe("getForecast", () => {
		it("should fetch forecast data by coordinates", async () => {
			const mockForecastData: ForecastData[] = [
				{
					dt: 1595243443,
					main: { temp: 25.32, feels_like: 24.85, temp_min: 24.0, temp_max: 26.0 },
					weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
					clouds: { all: 0 },
					wind: { speed: 3.6, deg: 90 },
					visibility: 10000,
					pop: 0,
					dt_txt: "2020-07-20 09:00:00",
					rain: { '1h': 0 },
					snow: { '1h': 0 }
				}
			];
			mockedAxios.get.mockResolvedValue({ data: { list: mockForecastData } });

			const result = await getForecast(params);
			expect(result).toEqual(mockForecastData);
		});
	});
});