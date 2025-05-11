import { NextRequest, NextResponse } from "next/server";
import { getCities, saveCities } from "./index";

export async function GET() {
  const cities = await getCities();
  return NextResponse.json(cities);
}

export async function POST(request: NextRequest) {
  const newCity = await request.json();
  const cities = await getCities();

  cities.push(newCity);
  await saveCities(cities);

  return NextResponse.json({ message: 'City added', city: newCity });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  let cities = await getCities();

  cities = cities.filter((city: any) => city.id !== id);
  await saveCities(cities);

  return NextResponse.json({ message: `City with id ${id} deleted.` });
}