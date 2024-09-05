import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@application/states/store';
import { useRouter } from 'next/router';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import styles from '@styles/Forecast.module.css';
import { Logger } from '@infrastructure/utils/Logger';
import { WeatherUseCases } from '@application/useCases/WeatherUseCases';

interface ForecastData {
  dateTime: String;
  temp: number;
  icon: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  rainVolumn: number;
  latitude: number;
  longitude: number
}

const Forecast: React.FC<{ latitude: number; longitude: number }> = ({ latitude, longitude }) => {
  const [hourlyForecast, setHourlyForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const temperatureUnit = useSelector((state: RootState) => state.temperatureUnit.unit);

  const geocodingService = new OpenWeatherGeocodingService(new OpenWeatherAPI());
  const router = useRouter();

  useEffect(() => {
    const fetchHourlyForecast = async () => {
      try {
        setIsLoading(true);
        const weatherData = await geocodingService.getHourlyForecast(latitude, longitude);
        const weatherViewModel = WeatherUseCases.mapWeatherDTOToViewModel(weatherData);
        Logger.log(`forecast data before transform: ${JSON.stringify(weatherViewModel)}`);

        let forecastDataArray: ForecastData[] = [];

        if (Array.isArray(weatherViewModel)) {
          forecastDataArray = weatherViewModel.map((item) => ({
            dateTime: item.bangkokTime,
            temp: item.getWeatherDTO().avgTemp,
            icon: item.weatherIcon,
            humidity: item.getWeatherDTO().humidity,
            windSpeed: item.getWeatherDTO().windSpeed,
            pressure: item.getWeatherDTO().pressure,
            rainVolumn: item.getWeatherDTO().rainVolumn,
            latitude: latitude,
            longitude: longitude,
          }));
        } else {
          forecastDataArray = [{
            dateTime: weatherViewModel.bangkokTime,
            temp: weatherViewModel.getWeatherDTO().avgTemp,
            icon: weatherViewModel.weatherIcon,
            humidity: weatherViewModel.getWeatherDTO().humidity,
            windSpeed: weatherViewModel.getWeatherDTO().windSpeed,
            pressure: weatherViewModel.getWeatherDTO().pressure,
            rainVolumn: weatherViewModel.getWeatherDTO().rainVolumn,
            latitude: latitude,
            longitude: longitude,
          }];
        }

        Logger.log(`forecast data after transform: ${JSON.stringify(forecastDataArray)}`);
        setHourlyForecast(forecastDataArray);
      } catch (error) {
        Logger.logError('Error fetching hourly forecast:', error);
        setError('Failed to fetch forecast data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHourlyForecast();
  }, [temperatureUnit, latitude, longitude]);

  const handleForecastClick = (forecast: ForecastData) => {
    router.push({
      pathname: '/ForecastPage',
      query: { forecastData: JSON.stringify(forecast) },
    });
  };

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollContainer = document.getElementById('forecast-scroll');
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) return <div>Loading forecast...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2 className={styles.forecastTitle}>24 Hours Forecast</h2>
      <div className={styles.forecastContainer}>
        <button className={`${styles.scrollButton} ${styles.scrollLeft}`} onClick={() => handleScroll('left')} />
        <div id="forecast-scroll" className={styles.forecastItems}>
          {hourlyForecast.map((forecast, index) => (
            <div key={index} className={styles.forecastItem} onClick={() => handleForecastClick(forecast)}>
              <div className={styles.forecastTime}>
                {forecast.dateTime}
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${forecast.icon}.png`}
                alt="weather icon"
                className={styles.forecastIcon}
              />
              <div className={styles.forecastTemp}>
                {`${Math.round(forecast.temp)}°`}
              </div>
            </div>
          ))}
        </div>
        <button className={`${styles.scrollButton} ${styles.scrollRight}`} onClick={() => handleScroll('right')} />
      </div>
    </div>
  );
};

export default Forecast;
