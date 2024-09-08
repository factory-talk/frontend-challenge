import React from 'react';
import Layout from '@presentation/layout/Layout';
import WeatherData from '@presentation/components/WeatherData';
import { OpenWeatherGeocodingService } from '@application/services/OpenWeatherGeocodingService';
import { OpenWeatherAPI } from '@infrastructure/api/OpenWeatherAPI';
import { WeatherController } from '@presentation/controllers/WeatherController';
import { Logger } from '@infrastructure/utils/Logger';

interface WeatherPageProps {
  serializedWeatherData: string | null;
  latitude: number | null;
  longitude: number | null;
}

const WeatherPage: React.FC<WeatherPageProps> = ({ serializedWeatherData, latitude, longitude }) => {
  if (!serializedWeatherData || latitude === null || longitude === null) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <p>Unable to load weather data. Please try again later.</p>
        </div>
      </Layout>
    );
  }

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

  const parsedLatitude = latitude ? parseFloat(latitude) : null;
  const parsedLongitude = longitude ? parseFloat(longitude) : null;

  if (!parsedLatitude || !parsedLongitude) {
    Logger.logError('Invalid or missing latitude and longitude query parameters.',null);
    return {
      props: {
        serializedWeatherData: null,
        latitude: null,
        longitude: null,
      },
    };
  }

  const weatherAPI = new OpenWeatherAPI();
  const weatherService = new OpenWeatherGeocodingService(weatherAPI);
  const weatherController = new WeatherController(weatherService);

  try {
    const weatherData = await weatherController.getWeatherForCity(parsedLatitude, parsedLongitude);

    if (!weatherData) {
      throw new Error('Weather data is null or undefined');
    }

    const serializedWeatherData = JSON.stringify(weatherData);

    return {
      props: {
        serializedWeatherData,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
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
