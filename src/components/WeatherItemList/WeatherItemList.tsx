import React, { useState, useEffect } from "react"
import WeatherItem from "../WeatherItem/WeatherItem"
import WeatherItemProps from "../../interfaces/WeatherItemProps"
import ActiveSearch from "src/interfaces/ActiveSearch"
import WeatherItemListProps from "src/interfaces/WeatherItemListProps"

// const getWeatherFromWeatherList = async (lat: number, lon: number) => {
//     const weatherRes = await fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + location.lat + "&lon=" + location.lon + "&exclude=minutely,daily,alerts&units=metric&appid=282135a6d4fac07bf00741f384ae42b8")
//     const weather = await weatherRes.json()
//     console.log(weather)
// }
const WeatherItemList: React.FC<WeatherItemListProps> = ({ activeSearch }) => {
    const [activeSearches, setActiveSearches] = useState<ActiveSearch[]>([])
    const [weatherItems, setWeatherItems] = useState<WeatherItemProps[]>([])

    useEffect(() => {
        if (activeSearch) {
            setActiveSearches((prevSearches) => [...prevSearches, activeSearch])
        }
        console.log(activeSearches)
    }, [activeSearch])

    return (
        <>
        {
            activeSearches.length > 0 && activeSearches.map((search, index)  => (<div key={index}>{search ? search.name : ""}</div>))
        }
        {/* {
            weatherItems.map((item, index) => (<WeatherItem key={index} {...item} />))
        } */}
        </>
    )
}

export default WeatherItemList