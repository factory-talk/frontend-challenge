import { ForecastData } from "@/interface/response/forecast-resp";
import { convertTimeHour } from "@/util/convert-date";
import Image from "next/image";


const HourlyForecast = ({ forecastData }: { forecastData: ForecastData[] }) => {

    return (
        <div className="rounded-lg pt-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">24-Hour Forecast</h3>
            <div className="overflow-x-auto">
                <div className="flex gap-4 pb-2" style={{ minWidth: '600px' }}>
                    {forecastData?.map((item, index) => (
                        <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-3 text-center min-w-[60px]">
                            <div className="text-sm font-medium text-gray-600 mb-2">{convertTimeHour(item.dt)}</div>
                            <div className="flex justify-center">
                                <Image
                                    alt='forecast-icon'
                                    width={48}
                                    height={48}
                                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                                />
                            </div>
                            <div className="text-sm font-semibold text-gray-800 mt-2">{item.main.temp}°C</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HourlyForecast