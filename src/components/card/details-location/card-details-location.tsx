import { ForecastResponse } from "@/app/api/forecast/route";
import { WeatherResponse } from "@/app/api/weather/route";
import { TimeCounter } from "@/components/time-counter";
import { Card } from "@/components/ui/card";
import { useWeatherBg } from "@/hooks/use-weather-bg";
import { getDateTimeByTimezone, mergeWeatherFormat } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { weatherForecastApi } from "src/services/get-current-weather";

export function CardDetailsLocation({
  data,
}: {
  data: WeatherResponse | null;
}) {
  const currentWeather = data?.weather?.[0].main;
  const weatherBg = useWeatherBg();
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(
    null
  );
  useEffect(() => {
    if (!currentWeather) return;
    weatherForecastApi({ ...data.coord }).then(({ success, data }) => {
      if (success) setForecastData(data);
    });
    weatherBg.change(mergeWeatherFormat(currentWeather));
  }, [currentWeather]);
  return (
    <div className="grow overflow-y-auto overflow-x-visible">
      <div className="grid grid-cols-1 gap-2 xl:grid-cols-3 *:mt-2 xl:*:m-0">
        <WeatherCard data={data} />
        <ForecastWeather data={forecastData} />
        <Clock
          timezone={forecastData?.city.timezone}
          label={data?.name || "Date Time"}
        />
      </div>
    </div>
  );
}

type WeatherCardProps = {
  data: WeatherResponse | null;
};

const WeatherCard = ({ data }: WeatherCardProps) => {
  if (!data) return null;

  const weather = data.weather[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <Card className="bg-white rounded-2xl shadow-md p-6 w-full mx-auto space-y-4 xl:col-span-3">
      <div className="flex items-center justify-between text-white">
        <div>
          <h2 className="text-xl font-semibold">
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-sm text-gray-200">
            {weather.main} - {weather.description}
          </p>
        </div>
        <img
          src={iconUrl}
          alt={weather.description}
          className="xl:size-[10rem]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm text-white">
        <div>
          <span className="font-medium">Avg Temp:</span>{" "}
          {data.main.temp.toFixed(1)}°C
        </div>
        <div>
          <span className="font-medium">Feels Like:</span>{" "}
          {data.main.feels_like.toFixed(1)}°C
        </div>
        <div>
          <span className="font-medium">Min Temp:</span>{" "}
          {data.main.temp_min.toFixed(1)}°C
        </div>
        <div>
          <span className="font-medium">Max Temp:</span>{" "}
          {data.main.temp_max.toFixed(1)}°C
        </div>
        <div>
          <span className="font-medium">Wind Speed:</span> {data.wind.speed} m/s
        </div>
        <div>
          <span className="font-medium">Humidity:</span> {data.main.humidity}%
        </div>
        <div>
          <span className="font-medium">Pressure:</span> {data.main.pressure}{" "}
          hPa
        </div>
        <div>
          <span className="font-medium">Rain Volume:</span>{" "}
          {"rain" in data ? `${(data as any).rain["1h"] ?? 0} mm` : "N/A"}
        </div>
      </div>
    </Card>
  );
};

const ForecastWeather = ({ data }: { data: ForecastResponse | null }) => {
  if (!data) return null;

  const next24Hours = data.list.slice(0, 24);

  const hourlyForecast = next24Hours.map((i) => ({
    time: i.dt_txt,
    temp: i.main.temp,
    description: i.weather[0].description,
    icon: `https://openweathermap.org/img/wn/${i.weather[0].icon}@2x.png`,
  }));

  return (
    <Card className="w-full p-4 shadow-sm rounded-xl gap-2 max-h-[100%] overflow-hidden xl:col-span-3">
      <h3 className="font-semibold text-lg text-white">24-Hour Forecast</h3>
      <div className="flex gap-4 xl:grid xl:grid-cols-3 xl:gap-4 overflow-x-auto">
        {hourlyForecast.map((hour, i) => (
          <div
            key={i}
            className="p-4 border border-white/20 rounded-lg text-center shrink-0"
          >
            <p className="text-sm font-semibold">
              {dayjs(hour.time).format("dddd")}
              <br />
              {dayjs(hour.time).format("hh:mm A")}
            </p>
            <img
              src={hour.icon}
              alt={hour.description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-lg font-bold">{Math.round(hour.temp)}°C</p>
            <p className="text-xs text-white">{hour.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const Clock = ({
  label,
  timezone,
}: {
  label: string;
  timezone: number | undefined;
}) => {
  const date = getDateTimeByTimezone(timezone || 0).split(" ")[0];
  const time = getDateTimeByTimezone(timezone || 0).split(" ")[1];

  if (!timezone || !date || !time) return null;
  return (
    <Card className="px-2 py-0 min-h-[3rem] !rounded-full shadow-md bg-white text-center w-fit flex-row items-center !fixed !bottom-0 !left-0 !m-2 gap-2">
      {label && (
        <div className="text-xl font-semibold text-white whitespace-nowrap max-w-[10rem] xl:max-w-[20rem] truncate">
          {label} :
        </div>
      )}
      <div className="text-xl font-semibold text-white whitespace-nowrap">
        {date} <TimeCounter startAt={time} />
      </div>
    </Card>
  );
};
