import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url || "");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json("Missing lat/lon", { status: 400 });
  }

  const rawData = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_APIKEY}`
  );
  const data = await rawData.json();
  return NextResponse.json(data)
}

export type WeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: WeatherMain;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type WeatherMain =
  | "Thunderstorm"
  | "Drizzle"
  | "Rain"
  | "Snow"
  | "Atmosphere"
  | "Clear"
  | "Clouds";

const mockData = {
  coord: {
    lon: 100.4906,
    lat: 13.9412,
  },
  weather: [
    {
      id: 804,
      main: "Clouds",
      description: "overcast clouds",
      icon: "04d",
    },
  ],
  base: "stations",
  main: {
    temp: 307.25,
    feels_like: 314.25,
    temp_min: 307.25,
    temp_max: 307.25,
    pressure: 1005,
    humidity: 69,
    sea_level: 1005,
    grnd_level: 1003,
  },
  visibility: 10000,
  wind: {
    speed: 4.52,
    deg: 275,
    gust: 9.02,
  },
  clouds: {
    all: 99,
  },
  dt: 1753871106,
  sys: {
    country: "TH",
    sunrise: 1753830100,
    sunset: 1753876026,
  },
  timezone: 25200,
  id: 1608048,
  name: "Pak Kret",
  cod: 200,
};
