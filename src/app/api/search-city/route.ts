import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query) return NextResponse.json([]);

  const res = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.WEATHER_APIKEY}`
  );
  const data = await res.json();

  if (!Array.isArray(data)) return NextResponse.json([]);

  return NextResponse.json(data);
}

export type SearchCityResponse = {
  name: string;
  country: string;
  lat: number;
  lon: number;
  state?: string;
};
