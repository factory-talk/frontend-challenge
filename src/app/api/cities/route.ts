import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataFilePath = path.join(process.cwd(), "src/app/data/city.list.json");

export async function getCities() {
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data);
}

export async function saveCities(cities: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(cities, null, 2));
}

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