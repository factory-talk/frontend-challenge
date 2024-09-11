import React, { useState, useEffect } from "react"
import WeatherItem from "../WeatherItem/WeatherItem"
import CurrentWeatherResponse from "../../interfaces/CurrentWeather/CurrentWeatherResponse"
import ActiveSearchResponse from "src/interfaces/ActiveSearch/ActiveSearchResponse"
import WeatherItemListProp from "src/interfaces/WeatherList/WeatherItemListProp"
import WeatherItemProp from "src/interfaces/WeatherList/WeatherItemProp"

const WeatherItemList: React.FC<WeatherItemListProp> = ({ activeSearch }) => {
    const [weatherItems, setWeatherItems] = useState<WeatherItemProp[]>([])

    const fetchWeatherItem = async (activeSearch: ActiveSearchResponse): Promise<void> => {
        const weatherRes = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + activeSearch.lat + "&lon=" + activeSearch.lon + "&units=metric&appid=282135a6d4fac07bf00741f384ae42b8")
        const weather: CurrentWeatherResponse = await weatherRes.json()
        setWeatherItems((prevWeatherItems) => [...prevWeatherItems, new WeatherItemProp(weather, activeSearch.name)])
    }

    useEffect(() => {
        if (activeSearch) {
            fetchWeatherItem(activeSearch)
        }
    }, [activeSearch])

    return (
        <>
        {
            weatherItems.map((item, index) => (<WeatherItem key={index} {...item}/>))
        }
        </>
    )
}

export default WeatherItemList