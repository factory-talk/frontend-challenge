import React from 'react';
import { useRouter } from 'next/router';
import HourlyForecastData from '@presentation/components/HourlyForecastData';
import Layout from '@presentation/layout/Layout';

const ForecastPage: React.FC = () => {
  const router = useRouter();
  const { forecastData } = router.query;

  if (!forecastData) {
    return <div>Loading...</div>;
  }

  const parsedForecastData = JSON.parse(forecastData as string);

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <HourlyForecastData forecastData={parsedForecastData} />
      </div>
    </Layout>
  );
};

export default ForecastPage;
