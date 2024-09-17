import { useState } from "react";
import { toReadableDateFormat } from "../utils/date.util";
import { celciusToFarenHeit, celciusToKelvin, numberWithCommas } from "../utils/number.util";
import { wordsToPascalCase } from "../utils/text.util";
import { ForecastWeather } from "./forecastweather";

export function TodayWeather({ data, forecastData, currentTempUnit, onSetSaveLocation, onLoadAllSavedLocations }: any) {

    const emptyData = !data || Object.keys(data).length === 0 || data.cod === '404';

    if (emptyData) {
        return (
            <></>
        );
    }

    const [saveButtonState, setSaveButtonState] = useState(true);

    const notAvailable = <span className="italic">N/A</span>;
    const dateNow = Math.floor(data.dt / 1000);
    const currentDate = new Date(dateNow);
    const [transformedDate, transformedTime] = toReadableDateFormat(currentDate);
    const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    const weatherMain = wordsToPascalCase(data.weather[0].main);
    const weatherDescription = wordsToPascalCase(data.weather[0].description);

    const rainAmount = (data.main.rain) ? data.main.rain.concat(' mm') : notAvailable;
    const weatherPressure = (data.main.pressure) ? numberWithCommas(data.main.pressure).concat(' hPa') : notAvailable;
    const weatherHumidity = (data.main.humidity) ? data.main.humidity.toString().concat('%') : notAvailable;
    const weatherWindSpeed = (data.wind.speed) ? data.wind.speed.toString().concat(' km/h') : notAvailable;

    let currentTemp = data.main.temp;
    let minTemp = data.main.temp_min;
    let maxTemp = data.main.temp_max;
    let averageTemp = ((data.main.temp_min + data.main.temp_max) / 2).toFixed(2);


    let displayTempUnit = <><sup>o</sup> C</>;
    switch (currentTempUnit) {
        case 'Farenheit':
            currentTemp = celciusToFarenHeit(data.main.temp);
            minTemp = celciusToFarenHeit(data.main.temp);
            maxTemp = celciusToFarenHeit(data.main.temp);
            averageTemp = celciusToFarenHeit(((data.main.temp_min + data.main.temp_max) / 2));
            displayTempUnit = <><sup>o</sup> F</>;
            break;
        case 'Kelvin':
            currentTemp = celciusToKelvin(data.main.temp);
            minTemp = celciusToKelvin(data.main.temp);
            maxTemp = celciusToKelvin(data.main.temp);
            averageTemp = celciusToKelvin(((data.main.temp_min + data.main.temp_max) / 2));
            displayTempUnit = <><sup>o</sup> K</>;
            break;
        default:
            currentTemp = data.main.temp;
            minTemp = data.main.temp_min;
            maxTemp = data.main.temp_max;
            averageTemp = ((data.main.temp_min + data.main.temp_max) / 2).toFixed(2);
            displayTempUnit = <><sup>o</sup> C</>;
            break;
    }

    return (
        <section className="items-center border-b border-stroke px-6 py-5 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark">
            <div className="w-full items-center">
                <div className="w-full shadow-xs mx-auto rounded-[5px] bg-white p-11 dark:bg-dark-2">
                    <div className="mb-10">
                        <p className="text-3xl font-semibold text-gray-700">{data.city}</p>
                        <p className="text-xl font-normal text-gray-500">{transformedTime}</p>
                        <p className="text-xl font-normal text-gray-500">{transformedDate}</p>
                        <p className="text-2xl font-semibold text-gray-800 mt-5">{weatherMain}</p>
                        <p className="text-md font-normal text-gray-500">{weatherDescription}</p>
                    </div>
                    <div className="mb-10">
                        <div className="flex">
                            <div className="flex-no-shring mr-5">
                                <img src={weatherIcon} />
                            </div>
                            <div className="relative">
                                <span className="text-6xl">{currentTemp}</span>
                                <sup className="text-lg absolute top-0 w-8">
                                    {displayTempUnit}
                                </sup>
                                <table className="table-auto mt-2">
                                    <tr>
                                        <td className="text-right xs:text-xs">Min:</td>
                                        <td className="ps-8 xs:text-xs">{minTemp} {displayTempUnit}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right xs:text-xs">Max:</td>
                                        <td className="ps-8 xs:text-xs">{maxTemp} {displayTempUnit}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right xs:text-xs">Average:</td>
                                        <td className="ps-8 xs:text-xs">{averageTemp} {displayTempUnit}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 w-full content-center">
                        <div className="mb-10">
                            <p className="font-semibold">Current details</p>
                            <table className="table-auto mt-3">
                                <tbody>
                                    <tr>
                                        <td className="text-right">Precipitation:</td>
                                        <td className="ps-8">{rainAmount}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Humidity:</td>
                                        <td className="ps-8">{weatherHumidity}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Wind:</td>
                                        <td className="ps-8">{weatherWindSpeed}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Pressure:</td>
                                        <td className="ps-8">{weatherPressure}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <a
                                href="javascript:void(0)"
                                className="border-dark dark:border-dark-2 hover:bg-gray-50 border rounded-full mt-3 inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-dark dark:text-white hover:bg-gray-4 dark:hover:bg-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5"
                                onClick={async () => {
                                        await onSetSaveLocation(data.id, data.city, data.coord.lat, data.coord.lon);
                                        setSaveButtonState(!saveButtonState);
                                        onLoadAllSavedLocations();
                                    }
                                }
                            >
                                <span className="pr-[10px]">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="fill-current"
                                    >
                                        <g clip-path="url(#clip0_906_8052)">
                                            <path
                                                d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z"
                                            />
                                            <path
                                                d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_906_8052">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                Save this location
                            </a>
                        </div>
                    </div>
                    <ForecastWeather data={forecastData} currentDt={data.dt} currentTempUnit={currentTempUnit} />
                </div>
            </div>
        </section>
        
    );
    /*
    <section className="grid grid-cols-2 mt-4">
            <div className="shadow-xs mx-auto w-min rounded-[5px] bg-white p-11 dark:bg-dark-2 col-start 1 col-span-2">
                <div className="p-3">
                    <div className="mb-10">
                        <p className="text-3xl font-semibold text-gray-700">{data.city}</p>
                        <p className="text-xl font-normal text-gray-500">{transformedTime}</p>
                        <p className="text-xl font-normal text-gray-500">{transformedDate}</p>
                        <p className="text-2xl font-semibold text-gray-800 mt-5">{weatherMain}</p>
                        <p className="text-md font-normal text-gray-500">{weatherDescription}</p>
                    </div>
                    <div className="mb-10">
                        <div className="flex">
                            <div className="flex-no-shring mr-5">
                                <img src={weatherIcon} />
                            </div>
                            <div className="relative">
                                <span className="text-6xl">{currentTemp}</span>
                                <sup className="text-lg absolute top-0 w-8">
                                    {displayTempUnit}
                                </sup>
                                <table className="table-auto mt-2">
                                    <tr>
                                        <td className="text-right xs:text-xs">Min:</td>
                                        <td className="ps-8 xs:text-xs">{minTemp} {displayTempUnit}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right xs:text-xs">Max:</td>
                                        <td className="ps-8 xs:text-xs">{maxTemp} {displayTempUnit}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right xs:text-xs">Average:</td>
                                        <td className="ps-8 xs:text-xs">{averageTemp} {displayTempUnit}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 w-full content-center">
                        <div className="mb-10">
                            <p className="font-semibold">Current details</p>
                            <table className="table-auto mt-3">
                                <tbody>
                                    <tr>
                                        <td className="text-right">Precipitation:</td>
                                        <td className="ps-8">{rainAmount}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Humidity:</td>
                                        <td className="ps-8">{weatherHumidity}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Wind:</td>
                                        <td className="ps-8">{weatherWindSpeed}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-right">Pressure:</td>
                                        <td className="ps-8">{weatherPressure}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <a
                                href="javascript:void(0)"
                                className="border-dark dark:border-dark-2 hover:bg-gray-50 border rounded-full mt-3 inline-flex items-center justify-center py-3 px-7 text-center text-base font-medium text-dark dark:text-white hover:bg-gray-4 dark:hover:bg-dark-3 disabled:bg-gray-3 disabled:border-gray-3 disabled:text-dark-5"
                                onClick={async () => {
                                        await onSetSaveLocation(data.id, data.city, data.coord.lat, data.coord.lon);
                                        setSaveButtonState(!saveButtonState);
                                        onLoadAllSavedLocations();
                                    }
                                }
                            >
                                <span className="pr-[10px]">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="fill-current"
                                    >
                                        <g clip-path="url(#clip0_906_8052)">
                                            <path
                                                d="M13.1875 9.28125H10.6875V6.8125C10.6875 6.4375 10.375 6.125 9.96875 6.125C9.59375 6.125 9.28125 6.4375 9.28125 6.84375V9.3125H6.8125C6.4375 9.3125 6.125 9.625 6.125 10.0312C6.125 10.4062 6.4375 10.7187 6.84375 10.7187H9.3125V13.1875C9.3125 13.5625 9.625 13.875 10.0312 13.875C10.4062 13.875 10.7187 13.5625 10.7187 13.1562V10.6875H13.1875C13.5625 10.6875 13.875 10.375 13.875 9.96875C13.875 9.59375 13.5625 9.28125 13.1875 9.28125Z"
                                            />
                                            <path
                                                d="M10 0.5625C4.78125 0.5625 0.5625 4.78125 0.5625 10C0.5625 15.2188 4.8125 19.4688 10.0312 19.4688C15.25 19.4688 19.5 15.2188 19.5 10C19.4688 4.78125 15.2188 0.5625 10 0.5625ZM10 18.0625C5.5625 18.0625 1.96875 14.4375 1.96875 10C1.96875 5.5625 5.5625 1.96875 10 1.96875C14.4375 1.96875 18.0625 5.5625 18.0625 10C18.0625 14.4375 14.4375 18.0625 10 18.0625Z"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_906_8052">
                                                <rect width="20" height="20" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </span>
                                Save this location
                            </a>
                        </div>
                    </div>
                    <ForecastWeather data={forecastData} currentDt={data.dt} currentTempUnit={currentTempUnit} />
                </div>
            </div>
        </section>*/
};