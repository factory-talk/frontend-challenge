import { NextRequest, NextResponse } from "next/server";
import { getCities } from "../index";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  const cities = await getCities();
  const filteredCities = cities
    .filter((city: any) => city.name.toLowerCase().includes(q))
    .slice(0, 5);

  return NextResponse.json(filteredCities);
}
