import React, { useEffect, useCallback, useState } from 'react';
import { Button, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@application/states/store';
import { removeCity, updateCityWeather, setSelectedCity } from '@application/states/slices/selectedCitiesSlice';
import { useRouter } from 'next/router';
import styles from '@presentation/styles/CitiesList.module.css';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { Logger } from '@infrastructure/utils/Logger';
import { DeleteOutlined } from '@ant-design/icons';

const CitiesList: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCities = useSelector((state: RootState) => state.selectedCities.cities);
  const selectedCity = useSelector((state: RootState) => state.selectedCities.selectedCity);
  const temperatureUnit = useSelector((state: RootState) => state.temperatureUnit.unit);

  const [updatedCities, setUpdatedCities] = useState<Record<string, string>>({});
  const router = useRouter();
  const geocodingService = new OpenWeatherGeocodingService(new OpenWeatherAPI());

  useEffect(() => {
    setUpdatedCities({});
  }, [temperatureUnit]);

  const fetchWeatherData = useCallback(async () => {
    if (selectedCities.length === 0) return; 

    const fetchPromises = selectedCities.map(async ({ city }) => {
      const cityName = city.getName();
      if (updatedCities[cityName] !== temperatureUnit) {
        try {
          const weatherData = await geocodingService.getWeatherData(city.getLatitude(), city.getLongitude());
          Logger.log(`Weather data for ${cityName}: ${JSON.stringify(weatherData)}`);
          
          dispatch(updateCityWeather({ cityName, weather: weatherData }));

          setUpdatedCities((prev) => ({ ...prev, [cityName]: temperatureUnit }));
        } catch (error) {
          Logger.logError(`Failed to fetch weather for ${cityName}: `, error);
        }
      }
    });

    await Promise.all(fetchPromises);
  }, [selectedCities, updatedCities, temperatureUnit, dispatch, geocodingService]);

  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  const handleNavigateToWeatherPage = (city: CityViewModel) => {
    dispatch(setSelectedCity(city));
    router.push(`/WeatherPage?latitude=${city.getLatitude()}&longitude=${city.getLongitude()}`);
  };

  const handleRemoveCity = (city: CityViewModel) => {
    dispatch(removeCity({ name: city.getName() }));

    if (selectedCity?.getName() === city.getName()) {
      dispatch(setSelectedCity(null));
    }
  };

  return (
    <div className={styles.selectedCitiesPlane}>
      <div className={styles.selectedCitiesContainer}>
        <List
          itemLayout="horizontal"
          dataSource={selectedCities}
          renderItem={({ city, weather }) => {
            const weatherViewModel = weather ? WeatherViewModel.deserialize(weather) : null;
            const weatherDTO = weatherViewModel?.getWeatherDTO();

            const avgTemp = weatherDTO?.avgTemp != null ? `${Math.round(weatherDTO.avgTemp)}°` : 'N/A';
            const maxTemp = weatherDTO?.maxTemp != null ? `${Math.round(weatherDTO.maxTemp)}°` : 'N/A';
            const minTemp = weatherDTO?.minTemp != null ? `${Math.round(weatherDTO.minTemp)}°` : 'N/A';

            return (
              <div className={styles.selectedCityItem} onClick={() => handleNavigateToWeatherPage(city)}>
                <div className={styles.flexCol}>
                  <span className={styles.fontMedium}>{city.getDisplayName()}</span>
                  {weatherDTO ? (
                    <div className={styles.weatherDetails}>
                      <div>{weatherDTO.mainWeather} {avgTemp}</div>
                      <div>H: {maxTemp} L: {minTemp}</div>
                    </div>
                  ) : (
                    <div className={styles.loadingText}>Loading weather...</div>
                  )}
                </div>
                <img
                  src={`http://openweathermap.org/img/wn/${weatherDTO?.icon}@4x.png`}
                  alt="weather icon"
                  className={styles.icon}
                />
                <Button
                  type="link"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveCity(city);
                  }}
                  className={styles.removeButton}
                />
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default CitiesList;
