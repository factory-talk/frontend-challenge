"use client";

import { useState, useEffect } from "react";
import { fetchAllWeatherData, fetchCities, fetchWeatherData } from "./services/weather.service";
import { Search } from "./components/search";
import { TodayWeather } from "./components/todayweather";
import { SavedLocations } from "./components/savedlocations";
import axios from "axios";

export default function Home() {

	const [todayWeather, setTodayWeather] = useState(null);
	const [forecastWeather, setForecastWeather] = useState(null);
	const [temperatureUnit, setTemperatureUnit] = useState('Celcius');
	const [savedLocations, setSavedLocations] = useState([]);

	const searchChangeHandler = async (enteredData: any) => {
		console.log(enteredData);
		const [latitude, longitude] = enteredData.value.split(' ');
		try {
			const [todayWeatherResp, hourlyForecastResp] = await fetchAllWeatherData(latitude, longitude);
			setTodayWeather({ city: enteredData.label, ...todayWeatherResp });
			setForecastWeather(hourlyForecastResp);
		} catch (error) {
			console.error(error);
		}
	};

	const onTempUnitStateChange = (newTempUnitState: string) => {
		setTemperatureUnit(newTempUnitState)
		window.sessionStorage.setItem('temperatureUnit', newTempUnitState);
	};

	const onSetSavedLocation = async (cityId: number, city: string, lat: number, long: number) => {
		const newLocation: PlaceLocation = {
			id: cityId,
			name: city,
			latitude: lat,
			longtitude: long
		};

		await axios.post(`${window.location.origin}/api/addlocation`, newLocation);
	}

	const onRemoveSavedLocationHandler = async (id: number) => {
		await axios.delete(`${window.location.origin}/api/removelocation?cityId=${id}`);
	}

	const loadAllSavedLocationsHandler = async () => {
        const returnData = await axios.get(`${window.location.origin}/api/getallsavedlocations`, {
            responseType: "json"
        }).then((resp) => {
			return resp.data;
        });

		setSavedLocations(returnData);

		return returnData;
    }

	return (
		<main className="flex min-h-screen flex-col items-center justify-between pt-24 pb-24 ps-12 pe-12">
			<div className="container mx-auto">
				<p className="text-4xl font-bold bg-gradient-to-l from-cyan-50 to-cyan-200 bg-clip-text text-transparent text-center">The Weather App</p>
				<Search onSearchChange={searchChangeHandler} tempUnit={temperatureUnit} onTempUnitChange={onTempUnitStateChange} />
				<TodayWeather data={todayWeather} forecastData={forecastWeather} currentTempUnit={temperatureUnit} onSetSaveLocation={onSetSavedLocation} onLoadAllSavedLocations={loadAllSavedLocationsHandler} />
				<SavedLocations onClickSavedLocation={searchChangeHandler} onRemoveSavedLocation={onRemoveSavedLocationHandler} onLoadAllSavedLocations={loadAllSavedLocationsHandler} savedLocations={savedLocations}  />
			</div>
		</main>
	);
}
