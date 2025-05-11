import { NextRequest, NextResponse } from "next/server";
import { getCities, saveCities } from "../index";

export async function PUT(request: NextRequest) {
  const updatedCity = await request.json();
  const url = new URL(request.url);
  const segments = url.pathname.split("/");
  const oldId = parseInt(segments[segments.length - 1]);

  if (isNaN(oldId)) {
    return NextResponse.json(
      { error: "Invalid city ID in URL" },
      { status: 400 }
    );
  }
  let cities = await getCities();
  const index = cities.findIndex((city: any) => city.id === oldId);

  if (index === -1) {
    return NextResponse.json({ error: "City not found" }, { status: 404 });
  }
  cities[index] = updatedCity;
  await saveCities(cities);

  return NextResponse.json({ message: "City updated", city: updatedCity });
}