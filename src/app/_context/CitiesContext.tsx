'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { City } from '../_lib/models';

const CitiesContext = createContext<any>(null);

export const CitiesContextProvider = ({ children }: { children: React.ReactNode }) => {
	const [selectedCities, setSelectedCities] = useState<City[]>([]);

	useEffect(() => {
		const storedCities = localStorage.getItem('selectedCities');
		if (storedCities) {			
			const selectedCities = JSON.parse(storedCities);
			setSelectedCities(selectedCities);
		}
	}, []);


	useEffect(() => { 
		if (selectedCities.length > 0) {
			localStorage.setItem('selectedCities', JSON.stringify(selectedCities));
		}
	}, [selectedCities]);

	const addCity = (city: City) => {
		if (selectedCities) {
			const removedDuplicatedCities = selectedCities.filter(c => c.id !== city.id);
			setSelectedCities([city, ...removedDuplicatedCities]);
		} else {
			setSelectedCities([city]);
		}
	};

	const removeCity = (city: City) => {
		setSelectedCities(selectedCities.filter(c => c.id !== city.id));
	};

	const getCityById = (id: string): City | undefined => {		
		const city = selectedCities.find(c => c.id === id);		
		return city;
	};

	return (
		<CitiesContext.Provider value= {{ selectedCities, addCity, removeCity, getCityById }
}>
			{children}
		</CitiesContext.Provider>
	);
};

const useSelectedCities = () => {
	const context = useContext(CitiesContext);
	if (context === undefined) {
		throw new Error('useSelectedCities must be used within a CitiesContextProvider');
	}
	return context;
}

export { useSelectedCities }