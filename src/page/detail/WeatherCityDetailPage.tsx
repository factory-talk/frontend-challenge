'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CityService } from '@/service/cityService';
import { ForecastService, ForecastResponse, DailyForecast, ForecastItem, CurrentWeatherResponse } from '@/service/forecastService';
import { City } from '@/model/CityModel';
import { WeatherData } from '@/model/WeatherData';
import { kelvinToCelsius } from '@/utils/weatherUtils';
import WeatherIcon from '@/components/WeatherIcon';
import Carousel from '@/components/Carousel';
import styles from './WeatherCityDetailPage.module.css';
const getTimezoneFromCoordinates = (lat: number, lon: number): string => {
  const utcOffset = Math.round(lon / 15);
  if (lon >= 97 && lon <= 107 && lat >= 5 && lat <= 25) {
    return 'Asia/Bangkok';
  } else if (lon >= 100 && lon <= 145 && lat >= -45 && lat <= -10) {
    return 'Australia/Sydney';
  } else if (lon >= 116 && lon <= 130 && lat >= 35 && lat <= 45) {
    return 'Asia/Tokyo';
  } else if (lon >= 73 && lon <= 135 && lat >= 5 && lat <= 55) {
    return 'Asia/Kolkata';
  } else if (lon >= -10 && lon <= 30 && lat >= 35 && lat <= 70) {
    return 'Europe/London';
  } else if (lon >= -130 && lon <= -60 && lat >= 25 && lat <= 50) {
    return 'America/New_York';
  } else if (lon >= -80 && lon <= -30 && lat >= -55 && lat <= 15) {
    return 'America/Sao_Paulo';
  }
  return utcOffset >= 0 ? `Etc/GMT-${utcOffset}` : `Etc/GMT+${Math.abs(utcOffset)}`;
};
interface CityDetailPageProps {
  city?: City;
}
const CityDetailPage: React.FC<CityDetailPageProps> = ({ city: propCity }) => {
  const params = useParams();
  const router = useRouter();
  const cityId = params?.id as string;
  const numericCityId = cityId ? parseInt(cityId, 10) : null;
  const [city, setCity] = useState<City | null>(null);
  const [currentWeatherData, setCurrentWeatherData] = useState<CurrentWeatherResponse | null>(null);
  const [forecastData, setForecastData] = useState<ForecastResponse | null>(null);
  const [dailyForecasts, setDailyForecasts] = useState<DailyForecast[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [hourlyData, setHourlyData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  useEffect(() => {
    const loadCityData = async () => {
      await CityService.loadCities();
      const foundCity = propCity || (numericCityId ? CityService.getCityById(numericCityId) : null);
      setCity(foundCity || null);
      setLoading(false);
      if (foundCity) {
        await loadForecastData(foundCity);
      }
    };
    loadCityData();
  }, [cityId, propCity, numericCityId]);
  const loadForecastData = async (city: City) => {
    setForecastLoading(true);
    try {
      const [currentWeather, forecast] = await Promise.all([
        ForecastService.getCurrentWeather(city),
        ForecastService.getForecast(city)
      ]);
      setCurrentWeatherData(currentWeather);
      setForecastData(forecast);
      if (forecast) {
        const groupedData = ForecastService.groupForecastByDay(forecast, currentWeather || undefined);
        setDailyForecasts(groupedData);
        if (groupedData.length > 0) {
          const todayDate = groupedData[0].date;
          setSelectedDay(todayDate);
          if (todayDate === new Date().toISOString().split('T')[0]) {
            setHourlyData(groupedData[0].items);
          } else {
            setHourlyData(groupedData[0].items);
          }
        }
      }
    } catch (error) {
      console.error('Error loading forecast data:', error);
    } finally {
      setForecastLoading(false);
    }
  };
  const handleDaySelect = (date: string) => {
    setSelectedDay(date);
    const selectedDayData = dailyForecasts.find(day => day.date === date);
    if (selectedDayData) {
      setHourlyData(selectedDayData.items);
    }
  };
  const getDisplayDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return 'Today';
    return ForecastService.formatDate(dateStr);
  };
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  const selectedDayForecasts = selectedDay 
    ? dailyForecasts.find(day => day.date === selectedDay)?.items || []
    : [];
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
        <div className="w-full mx-auto" style={{ maxWidth: '240px'}}>
            <div className="bg-white rounded-xl shadow-lg text-center" style={{ padding: '16px' }}>
              <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">Loading city information...</p>
            </div>
        </div>
      </div>
    );
  }
  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-[1024px] mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">🏙️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">City Not Found</h1>
            <p className="text-gray-600 mb-6">
              The city with ID &ldquo;{cityId}&rdquo; could not be found in our database.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 md:py-8 px-4 pb-8 md:pb-16">
      <div className="w-full max-w-[1024px] mx-auto">
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Search
          </button>
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                  {city.name}
                </h1>
                <div className="flex items-center text-gray-600 space-x-4 text-sm md:text-base">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {city.country}
                  </span>
                  {city.state && (
                    <span>• {city.state}</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs md:text-sm text-gray-500">City ID</div>
                <div className="text-lg md:text-2xl font-bold text-gray-900">
                  {city.id}
                </div>
              </div>
            </div>
          </div>
        </div>
        {forecastLoading ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center mb-6 md:mb-8 max-w-[240px] mx-auto">
            <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        ) : (
          <>
            <div className={`${styles.weatherSectionsContainer} flex flex-col md:flex-row gap-6 mb-8`}>
            {currentWeatherData && (
              <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 ${styles.currentWeatherCard} flex-1`}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Current Weather</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {kelvinToCelsius(currentWeatherData.main.temp)}°C
                    </div>
                    <div className="text-gray-600 mt-1">Temperature</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Feels like {kelvinToCelsius(currentWeatherData.main.feels_like)}°C
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">
                      <WeatherIcon 
                        iconCode={currentWeatherData.weather[0].icon}
                        theme="auto"
                        timestamp={currentWeatherData.dt}
                        timezone={getTimezoneFromCoordinates(city.coord.lat, city.coord.lon)}
                      />
                    </div>
                    <div className="font-medium text-gray-900 capitalize">
                      {currentWeatherData.weather[0].description}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentWeatherData.main.humidity}%
                    </div>
                    <div className="text-gray-600">Humidity</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Pressure: {currentWeatherData.main.pressure} hPa
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentWeatherData.wind.speed} m/s
                    </div>
                    <div className="text-gray-600">Wind Speed</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Direction: {currentWeatherData.wind.deg}°
                    </div>
                  </div>
                </div>
              </div>
            )}
            {dailyForecasts.length > 0 && (
              <div className={`bg-white rounded-xl shadow-lg p-6 md:p-8 ${styles.forecastCard} flex-1 flex flex-col`}>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Forecast</h2>
                <div className="flex-1 flex items-center">
                  <Carousel 
                    itemsPerView={3}
                    showArrows={true}
                    showDots={false}
                  >
                  {dailyForecasts.slice(0, 5).map((dayForecast, index) => (
                    <div 
                      key={dayForecast.date}
                      onClick={() => handleDaySelect(dayForecast.date)}
                      className={`
                        p-6 rounded-lg cursor-pointer transition-all duration-200 w-full
                        ${selectedDay === dayForecast.date 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <div className="text-center">
                        <div className="font-medium text-gray-900 mb-2">
                          {index === 0 ? 'Today' : ForecastService.formatDate(dayForecast.date)}
                        </div>
                        <div className="text-4xl mb-3">
                          <WeatherIcon 
                            iconCode={dayForecast.weatherIcon}
                            theme="auto"
                            timestamp={dayForecast.items[0]?.dt}
                            timezone={getTimezoneFromCoordinates(city.coord.lat, city.coord.lon)}
                          />
                        </div>
                        <div className="space-y-1">
                          <div className="font-bold text-lg text-gray-900">
                            {kelvinToCelsius(dayForecast.maxTemp)}°
                          </div>
                          <div className="text-sm text-gray-500">
                            {kelvinToCelsius(dayForecast.minTemp)}°
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {dayForecast.mainWeather}
                        </div>
                        <div className="text-xs text-gray-500">
                          🌧️ {dayForecast.rainProbability}%
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
                </div>
              </div>
            )}
            </div>
            {selectedDay && hourlyData.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                  Hourly Forecast - {selectedDay === new Date().toISOString().split('T')[0] 
                    ? 'Today' 
                    : ForecastService.formatDate(selectedDay)
                  }
                </h2>
                <Carousel 
                  itemsPerView={4}
                  showArrows={true}
                  showDots={false}
                >
                  {hourlyData.map((hourData, index) => (
                    <div key={index} className="p-4 rounded-lg w-full">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          {new Date(hourData.dt * 1000).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </div>
                        <div className="text-3xl mb-2">
                          <WeatherIcon 
                            iconCode={hourData.weather[0].icon}
                            theme="auto"
                            timestamp={hourData.dt}
                            timezone={getTimezoneFromCoordinates(city.coord.lat, city.coord.lon)}
                          />
                        </div>
                        <div className="font-bold text-lg text-gray-900 mb-1">
                          {kelvinToCelsius(hourData.main.temp)}°C
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {hourData.weather[0].description}
                        </div>
                        <div className="text-xs text-gray-500">
                          💧 {hourData.main.humidity}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {hourData.wind.speed} m/s 💨
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
            <div className={styles.cardsContainer}>
              <div className={`bg-white rounded-xl shadow-lg ${styles.cityInfoCard}`}>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Location
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Country</label>
                    <p className="text-lg text-gray-900">{city.country}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">State</label>
                    <p className="text-lg text-gray-900">{city.state || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Coordinates</label>
                    <p className="text-lg font-mono text-gray-900">
                      {city.coord.lat.toFixed(4)}°, {city.coord.lon.toFixed(4)}°
                    </p>
                  </div>
                </div>
              </div>
              <div className={`bg-white rounded-xl shadow-lg ${styles.weatherInfoCard}`}>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Weather Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">City ID</label>
                    <p className="text-sm font-mono p-2 rounded text-gray-900">{city.id}</p>
                  </div>
                  {currentWeatherData && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                        <p className="text-sm text-gray-900">{formatDate(currentWeatherData.dt)}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Timezone</label>
                        <p className="text-sm text-gray-900">UTC{currentWeatherData.timezone >= 0 ? '+' : ''}{currentWeatherData.timezone / 3600}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Data Source</label>
                        <p className="text-sm text-gray-900 capitalize">{currentWeatherData.base}</p>
                      </div>
                    </>
                  )}
                  {forecastData && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Forecast Points</label>
                      <p className="text-sm text-gray-900">{forecastData.cnt} data points</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default CityDetailPage;

