"use client";
import moment from "moment";

type ForecastModel = {
    dt: number;
    weather: { main: string; description: string; icon: string; }[];
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        sea_level: number;
    };
};

type Props = {
  forecastList: ForecastModel[];
  timezoneOffset: number;
};

export default function Forecast({ forecastList, timezoneOffset }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5">
      {forecastList.map((item, index) => {
        const localTime = moment.unix(item.dt + timezoneOffset).utc().format("ddd HH:mm");

        return (
          <div key={index} className="forecast-box">
            <p className="font-bold">{localTime}</p>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="icon" width={150} height={150} />
            <p className="text-xl font-bold">{item.main.temp.toFixed(1)}°C</p>
            <p className="text-gray-600">{item.weather[0].description}</p>
          </div>
        );
      })}
    </div>
  );
}
