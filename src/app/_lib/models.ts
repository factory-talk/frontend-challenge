export interface City {
	id: string;
	place_name: string;
	text: string;
	center: [number, number]; // [longitude, latitude]
	weather: WeatherData;
}

export interface Country {
	name: {
		common: string;
	}
	cca2: string;
}

export interface WeatherData {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
	};
	clouds: {
		all: number;
	};
	rain: {
		'1h': number;
	};
	snow: {
		'1h': number;
	};
	dt: number;
	timezone: number;
	id: number;
	name: string;
	cod: number;
	forecasts: ForecastData[];
}

export interface ForecastData {
	dt: number;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	clouds: {
		all: number;
	}
	wind: {
		speed: number;
		deg: number;
	};
	visibility: number;
	pop: number;
	rain: {
		'1h': number;
	};
	snow: {
		'1h': number;
	};
	dt_txt: string;
}