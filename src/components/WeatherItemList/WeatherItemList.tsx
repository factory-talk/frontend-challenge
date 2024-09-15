import React, { useState, useEffect } from "react"
import WeatherItem from "../WeatherItem/WeatherItem"
import CurrentWeatherResponse from "../../interfaces/CurrentWeather/CurrentWeatherResponse"
import ActiveSearchResponse from "src/interfaces/ActiveSearch/ActiveSearchResponse"
import WeatherItemListProp from "src/interfaces/WeatherList/WeatherItemListProp"
import WeatherProp from "src/interfaces/Common/WeatherProp"
import { API_BASE_URL, DEFAULT_UNITS, OPENWEATHER_API_KEY } from "src/config/api"

const WeatherItemList: React.FC<WeatherItemListProp> = ({ activeSearch }) => {
    const [weatherItems, setWeatherItems] = useState<WeatherProp[]>([])

    const fetchWeatherItem = async (activeSearch: ActiveSearchResponse): Promise<void> => {
        const weatherRes = await fetch(`${API_BASE_URL}/data/2.5/weather?lat=${activeSearch.lat}&lon=${activeSearch.lon}&units=${DEFAULT_UNITS}&appid=${OPENWEATHER_API_KEY}`)
        const weather: CurrentWeatherResponse = await weatherRes.json()
        saveWeatherItems(activeSearch.name, weather)
    }

    useEffect(() => {
        const sessionWeatherItems: string = sessionStorage.getItem("weatherItems") || "[]";
        const parsedWeatherItems: WeatherProp[] = JSON.parse(sessionWeatherItems).map(
            (item: any) => WeatherProp.fromJson(item)
        );
        setWeatherItems(parsedWeatherItems);
    }, [])

    useEffect(() => {
        if (activeSearch) {
            fetchWeatherItem(activeSearch)
        }
    }, [activeSearch])

    const saveWeatherItems = (cityDisplayName: string, weather: CurrentWeatherResponse) => {
        const newWeatherItem = new WeatherProp(cityDisplayName, weather)
        setWeatherItems((prevWeatherItems) => [...prevWeatherItems, newWeatherItem])
        saveToSessionStorage([...weatherItems, newWeatherItem])
    }

    const removeWeatherItem = (openWeatherName: string) => {
        const sessionWeatherItems: string = sessionStorage.getItem("weatherItems") || "[]";
        const filteredWeatherItems: WeatherProp[] = parseWeatherProp(sessionWeatherItems).filter((item) => item.name !== openWeatherName)
        saveToSessionStorage(filteredWeatherItems)
        setWeatherItems(filteredWeatherItems)
    }

    const parseWeatherProp = (s: string): WeatherProp[] => {
        return JSON.parse(s).map(
            (item: any) => WeatherProp.fromJson(item)
        )
    }

    const saveToSessionStorage = (weatherProps: WeatherProp[]): void => {
        const stringWeatherProps = weatherProps.map(weatherItem => {
            return weatherItem.toJson()
        })
        sessionStorage.setItem("weatherItems", JSON.stringify(stringWeatherProps))
    }

    return (
        <>
            {
                weatherItems.length > 0 && weatherItems.map((item, index) => (<WeatherItem key={index} removeWeatherItemProp={removeWeatherItem} weatherProp={item} />))
            }
        </>
    )
}

export default WeatherItemList