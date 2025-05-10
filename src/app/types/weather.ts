export type City = {
  id: number;
  name: string;
  state: string;
  country: string;
  coord: {
    lon: number;
    lat: number;
  };
};

export interface GroupWeatherResponse {
  cnt: number;
  list: GroupWeatherData[];
}

export interface GroupWeatherData {
  coord: Coord;
  sys: Sys;
  weather: Weather[];
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  id: number;
  name: string;
}

export type WeatherResponse = {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  rain: Rain;
  clouds: Clouds;
  dt: number;
  sys: Sys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export interface Coord {
  lon: number;
  lat: number;
}

export interface Sys {
  type: number | null;
  id: number | null;
  country: string;
  timezone: number | null;
  sunrise: number;
  sunset: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
}

export interface Wind {
  speed: number;
  deg: number;
  gust: number | null;
}

export interface Rain {
  '1h': number;
}

export interface Clouds {
  all: number;
}
