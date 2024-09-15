import WeatherProp from "../Common/WeatherProp"

interface WeatherItemProp {
    removeWeatherItemProp: (cityDisplayName: string) => void
    weatherProp: WeatherProp
}

export default WeatherItemProp