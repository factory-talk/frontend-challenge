import WeatherItem from "../WeatherItem/WeatherItem"
import WeatherItemProps from "../../interfaces/WeatherItemProps"
const getWeatherFromWeatherList = async (lat: number, lon: number) => {
    const weatherRes = await fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + location.lat + "&lon=" + location.lon + "&exclude=minutely,daily,alerts&units=metric&appid=282135a6d4fac07bf00741f384ae42b8")
    const weather = await weatherRes.json()
    console.log(weather)
}
const WeatherItemList = () => {
    const numberOfItems: WeatherItemProps[] = [
        {
            cityName: "New York",
            dateTime: new Date(),
            icon: "🌤️",
            temp: 3,
        },
        {
            cityName: "Los Angeles",
            dateTime: new Date(),
            icon: "☀️",
            temp: 28,
        },
        {
            cityName: "Chicago",
            dateTime: new Date(),
            icon: "❄️",
            temp: -5,
        },
    ]
    return (
        <>
        {
            numberOfItems.map((item, index) => (<WeatherItem key={index} {...item} />))
        }
        </>
    )
}

export default WeatherItemList