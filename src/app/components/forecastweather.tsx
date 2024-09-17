import { celciusToFarenHeit, celciusToKelvin } from "../utils/number.util";

function printForecastWeather(forecastItem: any, currentTempUnit: string) {

    const splitDtTexts = forecastItem.dt_txt.split(' ');
    const splitTime = splitDtTexts[1].split(':');
    const hourlyTime = splitTime[0].concat(':', splitTime[1]);
    const weatherIcon = `https://openweathermap.org/img/wn/${forecastItem.weather[0].icon}.png`;

    let forecastTemp = forecastItem.main.temp;
    switch (currentTempUnit) {
        case 'Farenheit':
            forecastTemp = celciusToFarenHeit(forecastItem.main.temp);
            break;
        case 'Kelvin':
            forecastTemp = celciusToKelvin(forecastItem.main.temp);
            break;
        default:
            forecastTemp = forecastItem.main.temp;
            break;
    }

    return (
        <div className="flex-col items-center mr-5">
            <p className="text-gray-500">
                {hourlyTime}
            </p>
            <img src={weatherIcon} />
            <p>
                {forecastTemp} <sup>o</sup>
            </p>
        </div>
    );
}

export function ForecastWeather({ data, currentDt, currentTempUnit }: any) {

    const emptyData = !data || Object.keys(data).length === 0 || data.cod === '404';

    if (emptyData) {
        return (
            <></>
        );
    }

    const filteredForecastItems = data.list.slice(1, 10);

    const hourlyItems = [];
    for (const forcastItem of filteredForecastItems) {
        hourlyItems.push(printForecastWeather(forcastItem, currentTempUnit));
    }

    return (
        <section className="overflow-x-auto [&::-webkit-scrollbar]:w-1
                            [&::-webkit-scrollbar-track]:bg-gray-100
                            [&::-webkit-scrollbar-thumb]:bg-gray-300
                            dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                            dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
            <p className="mb-4">24 Hours Forecast</p>
            <div className="flex">
                {hourlyItems}
            </div>
        </section>
    );
    
}