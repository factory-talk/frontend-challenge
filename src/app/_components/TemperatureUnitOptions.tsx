'use client'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const unitOptions = [
	{ value: 'celsius', label: 'Celsius' },
	{ value: 'fahrenheit', label: 'Fahrenheit' },
	{ value: 'kelvin', label: 'Kelvin' }
]


function TemperatureUnitOptions() {

	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	
	const unit = searchParams.get('unit') || 'celsius';

	const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newUnit = e.target.value;

		if (newUnit === unit || unitOptions.find(option => option.value === newUnit) === undefined) {
			return;
		}
		
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set('unit', newUnit);
		router.push(`${pathname}?${newSearchParams.toString()}`);
	}

	return (
		<div className="flex items-center gap-2 text-sm text-gray-600">
			<span>Temperature Unit: </span>
			<select 
				className="p-2 pl-4 pr-4 border rounded-md" 
				onChange={handleUnitChange}
				value={unit}>
				{unitOptions.map((option) => (
					<option key={option.value} value={option.value}>{option.label}</option>
				))}
			</select>
		</div>
	)
}

export default TemperatureUnitOptions