import React from 'react';
import Layout from '@presentation/layout/Layout';
import WeatherData from '@presentation/components/WeatherData';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { WeatherController } from '@presentation/controllers/WeatherController';
import { Logger } from '@infrastructure/utils/Logger';

interface WeatherPageProps {
  serializedWeatherData: string;
  latitude: number;
  longitude: number;
}

const WeatherPage: React.FC<WeatherPageProps> = ({ serializedWeatherData, latitude, longitude }) => {
  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <WeatherData serializedWeatherData={serializedWeatherData} latitude={latitude} longitude={longitude} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const { latitude, longitude } = context.query;

  const weatherAPI = new OpenWeatherAPI();
  const weatherService = new OpenWeatherGeocodingService(weatherAPI);
  const weatherController = new WeatherController(weatherService);

  try {
    const weatherData = await weatherController.getWeatherForCity(parseFloat(latitude), parseFloat(longitude));

    if (!weatherData) {
      throw new Error("Weather data is null or undefined");
    }

    const serializedWeatherData = JSON.stringify(weatherData);

    return {
      props: {
        serializedWeatherData,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };
  } catch (error) {
    Logger.logError('Failed to fetch weather data:', error);
    return {
      props: {
        serializedWeatherData: null,
        latitude: null,
        longitude: null,
      },
    };
  }
}

export default WeatherPage;
