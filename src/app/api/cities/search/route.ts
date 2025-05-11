import { NextRequest, NextResponse } from "next/server";
import { getCities } from "../index";
import { SEARCH_SUGGESTION_LIMIT } from "../../../utils/config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase() || "";

  const cities = await getCities();
  const filteredCities = cities
    .filter((city: any) => city.name.toLowerCase().includes(q))
    .slice(0, SEARCH_SUGGESTION_LIMIT);

  return NextResponse.json(filteredCities);
}
