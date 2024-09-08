import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@application/states/store';
import { WeatherViewModel } from '@application/dtos/WeatherViewModel';
import { Logger } from '@infrastructure/utils/Logger';
import { setSelectedCity } from '@application/states/slices/selectedCitiesSlice';
import styles from '@styles/WeatherData.module.css';
import Forecast from '@presentation/components/Forecast';
import { useRouter } from 'next/router';
import { CityViewModel } from '@application/dtos/CityViewModel';
import { SearchOutlined } from '@ant-design/icons'; 
import { WeatherController } from '@presentation/controllers/WeatherController';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';

interface WeatherDataProps {
  serializedWeatherData: string;
  latitude: number;
  longitude: number;
}

const WeatherData: React.FC<WeatherDataProps> = ({ serializedWeatherData, latitude, longitude }) => {
  const dispatch = useDispatch();
  const selectedCity = useSelector((state: RootState) => state.selectedCities.selectedCity);
  const router = useRouter();
  const temperatureUnit = useSelector((state: RootState) => state.temperatureUnit.unit);

  const [clientSideTime, setClientSideTime] = useState<string | null>(null);
  const [weatherViewModel, setWeatherViewModel] = useState<WeatherViewModel | null>(null);

  const fetchWeatherData = useCallback(async () => {
    const weatherAPI = new OpenWeatherAPI();
    const weatherService = new OpenWeatherGeocodingService(weatherAPI);
    const weatherController = new WeatherController(weatherService);

    try {
      const weatherData = await weatherController.getWeatherForCity(latitude, longitude);
      if (!weatherData) {
        throw new Error("Weather data is null or undefined");
      }
      return WeatherViewModel.deserialize(weatherData);
    } catch (error) {
      Logger.logError("Error fetching weather data", error);
      return null;
    }
  }, [latitude, longitude, temperatureUnit]);

  useEffect(() => {
    Logger.log('WeatherData component props:', { serializedWeatherData, latitude, longitude });

    const initializeWeatherData = async () => {
      if (serializedWeatherData) {
        try {
          const weatherData = JSON.parse(serializedWeatherData);
          Logger.log("Data before sending to WeatherViewModel for deserialization:", JSON.stringify(weatherData));
          const viewModel = WeatherViewModel.deserialize(weatherData);
          setWeatherViewModel(viewModel);
          setClientSideTime(viewModel.bangkokDateTime);
          Logger.log('WeatherViewModel created:', viewModel);
        } catch (error) {
          Logger.logError("Error parsing weather data", error);
        }
      } else {
        const updatedWeatherViewModel = await fetchWeatherData();
        if (updatedWeatherViewModel) {
          setWeatherViewModel(updatedWeatherViewModel);
          setClientSideTime(updatedWeatherViewModel.bangkokDateTime);
        }
      }
    };

    initializeWeatherData();
  }, [serializedWeatherData, fetchWeatherData]);

  Logger.log("country time: ",clientSideTime)

  useEffect(() => {
    if (!selectedCity || selectedCity.getLatitude() !== latitude || selectedCity.getLongitude() !== longitude) {
      const newCity = new CityViewModel({
        name: selectedCity?.getName() || `Lat: ${latitude}, Lon: ${longitude}`,
        country: selectedCity?.getCountry() || '',
        displayName: `Lat: ${latitude}, Lon: ${longitude}`,
        latitude,
        longitude,
      });

      dispatch(setSelectedCity(newCity));
    }

    if (typeof window !== 'undefined' && selectedCity) {
      localStorage.setItem('selectedCity', JSON.stringify(selectedCity.serialize()));
    }
  }, [latitude, longitude, selectedCity, dispatch]);

  useEffect(() => {
    const updateWeatherData = async () => {
      const updatedWeatherViewModel = await fetchWeatherData();
      if (updatedWeatherViewModel) {
        setWeatherViewModel(updatedWeatherViewModel);
        setClientSideTime(updatedWeatherViewModel.bangkokDateTime);
      }
    };

    updateWeatherData();
  }, [temperatureUnit, fetchWeatherData]);

  if (!weatherViewModel) {
    return <div className="flex items-center justify-center min-h-screen text-xl">Loading data...</div>;
  }

  const weatherDTO = weatherViewModel.getWeatherDTO();
  
  Logger.log(`Displaying weather for ${selectedCity?.getName() || weatherDTO.cityName}`, weatherDTO);

  const redirectToHomePage = () => {
    router.push('/');
  };

  return (
    <div className={`${styles.container} flex-container w-full`}>
      <button onClick={redirectToHomePage} className={styles.redirectButton}>
        <SearchOutlined />
      </button>
      <div className="text-center mb-6">
        <h1 className={styles.cityName}>{selectedCity?.getName() || weatherDTO.cityName}</h1>
        <p className={styles.time}>{clientSideTime || 'Loading time...'}</p>
      </div>
      <div className={`${styles.tempSection} flex-row`}>
        <img
          src={`http://openweathermap.org/img/wn/${weatherViewModel.weatherIcon}@4x.png`}
          alt={weatherDTO.descWeather}
          className={styles.icon}
        />
        <h2 className={styles.temp}>{Math.round(weatherDTO.avgTemp)}°</h2>
        <div className={styles.minmax}>
          min {Math.round(weatherDTO.minTemp)}° max {Math.round(weatherDTO.maxTemp)}°
        </div>
      </div>
      <p className={styles.mainWeather}>{weatherDTO.mainWeather}</p>
      <div className={styles.futureSection}>
        <Forecast latitude={latitude} longitude={longitude} />
      </div>
      <div className={styles.currentDetails}>
        <h3 className="text-2xl font-extrabold text-center mb-4">Current Details</h3>
        <div className={styles.detailsTable}>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Humidity</span>
            <span className={styles.detailsValue}>{weatherDTO.humidity}%</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Wind</span>
            <span className={styles.detailsValue}>{weatherDTO.windSpeed} km/h</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Pressure</span>
            <span className={styles.detailsValue}>{weatherDTO.pressure} mBar</span>
          </div>
          <div className={styles.detailsRow}>
            <span className={styles.detailsLabel}>Chance of rain</span>
            <span className={styles.detailsValue}>{weatherDTO.rainVolumn || 0} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherData;
