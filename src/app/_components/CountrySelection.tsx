'use client'

import React, { useEffect, useState } from 'react'
import { getCountries } from '../_services/apiPlace';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function CountrySelection () {

	const [countries, setCountries] = useState<any[]>([]);
	const searchParams = useSearchParams();
	const country = searchParams.get('country') || 'all';
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const fetchCountries = async () => {
			const countries = await getCountries();
			setCountries(countries.sort((a, b) => a.name.common.localeCompare(b.name.common)));			
		}
		fetchCountries();
	}, []);
	
	const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {		
		const selectedCountry = event.target.value;

		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('country', selectedCountry);
		router.push(`${pathname}?${newSearchParams.toString()}`);
	}

	return (		
		<select 
			className="p-2 pl-4 pr-4 border rounded-md w-full md:w-48"
			value={country}
			onChange={handleCountryChange}
			role="option-country"
		>
			<option value="all">Anywhere</option>
			{countries.map((country, index) => (
				<option key={index} value={country.cca2}>{country.name.common}</option>
			))}
		</select>		
	)
}

export default CountrySelection;