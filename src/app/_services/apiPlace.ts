import axios from "axios"
import { City, Country } from "../_lib/models";

const fetchLimit = 10;

export async function getCitiesByName (search: string, countryCode?: string): Promise<City[]> {
	const countryParam = countryCode ? `&country=${countryCode}` : '';
	try {
		const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${search}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&types=place&limit=${fetchLimit}${countryParam}`);
		return response.data.features || [];
	} catch (error) {
		console.error("Error fetching cities by name:", error);
		throw error;
	}
}

export async function getCitiesByZip (zipCode: string, countryCode: string): Promise<City[]> {
	const countryParam = countryCode ? `&country=${countryCode}` : '';
	try {
		const response = await axios.get(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${zipCode}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}&types=postcode&limit=${fetchLimit}${countryParam}`);
		return response.data.features || [];
	} catch (error) {
		console.error("Error fetching cities by ZIP code:", error);
		throw error;
	}
}

export async function getCountries (): Promise<Country[]> {
	try {
		const countries = await axios.get(`https://restcountries.com/v3.1/all?fields=name,cca2`);
		return countries.data as Country[];
	} catch (error) {
		console.error("Error fetching countries:", error);
		throw error;
	}
}