import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/app/data/city.list.json");

export async function getCities() {
  const data = await fs.readFile(dataFilePath, "utf-8");
  return JSON.parse(data);
}

export async function saveCities(cities: any[]) {
  await fs.writeFile(dataFilePath, JSON.stringify(cities, null, 2));
}