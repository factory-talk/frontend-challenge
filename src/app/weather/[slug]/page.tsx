"use client";
import Image from "next/image";
import TopNavigator from "../../components/ui/topNavigator";
import SkeletionDetail from "../../components/ui/skeletionDetail";
import ErrorBox from "../../components/ui/errorBox";
import Loading from "../../components/ui/loading";
import { useRouter } from "next/navigation";
import { useFetchDetailWeatherData } from "../../hooks/useWeatherData";
import { motion } from "framer-motion";
import { pageVariants, fadeInUp } from "../../lib/animations/motionConfig";

type Props = {
  params: { slug: string };
};

export default function WeatherPage({ params }: Props) {
  const { slug } = params;
  const { weatherData, loading, error } = useFetchDetailWeatherData(slug);
  
  const decodedSlug = decodeURIComponent(slug);
  const router = useRouter();

  const handleBack = () => {
    router.push(`/`);
  };

  return (
    <motion.main
      className="flex min-h-screen flex-col items-center justify-start p-8 text-gray-800"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={pageVariants}
    >
      <TopNavigator onClickBack={handleBack} />
      {loading ? (
        <div className="w-full max-w-xs">
          <Loading />
          <SkeletionDetail />
        </div>
      ) : error ? (
        <ErrorBox Title={decodedSlug} Detail={error} />
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-white text-3xl font-bold mt-8 mb-2"
            custom={0}
            variants={fadeInUp}
          >
            {weatherData?.name}
          </motion.h1>
          <motion.h2
            className="text-white text-xl mb-4"
            custom={1}
            variants={fadeInUp}
          >
            {weatherData && (weatherData.main.temp - 273.15).toFixed(1)}°C
          </motion.h2>

          <motion.div 
            className="mb-4" 
            custom={2} 
            variants={fadeInUp}
          >
            <Image
              src={`https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`}
              alt="weather icon"
              width={150}
              height={150}
            />
          </motion.div>

          <motion.div
            className="w-full max-w-xl overflow-x-auto rounded-lg"
            custom={3}
            variants={fadeInUp}
          >
            <table className="w-full table-auto border-collapse border border-gray-300 bg-white shadow-md rounded">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">Parameter</th>
                  <th className="px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Average Temperature</td>
                  <td className="px-4 py-2">{weatherData?.main.temp} K</td>
                </tr>
                <tr className="bg-gray-50 border-t">
                  <td className="px-4 py-2">Min Temperature</td>
                  <td className="px-4 py-2">{weatherData?.main.temp_min} K</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Max Temperature</td>
                  <td className="px-4 py-2">{weatherData?.main.temp_max} K</td>
                </tr>
                <tr className="bg-gray-50 border-t">
                  <td className="px-4 py-2">Weather</td>
                  <td className="px-4 py-2">{weatherData?.weather[0].main}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Description</td>
                  <td className="px-4 py-2 capitalize">
                    {weatherData?.weather[0].description}
                  </td>
                </tr>
                <tr className="bg-gray-50 border-t">
                  <td className="px-4 py-2">Wind Speed</td>
                  <td className="px-4 py-2">{weatherData?.wind.speed} m/s</td>
                </tr>
                <tr className="bg-gray-50 border-t">
                  <td className="px-4 py-2">Humidity</td>
                  <td className="px-4 py-2">{weatherData?.main.humidity} %</td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Pressure</td>
                  <td className="px-4 py-2">
                    {weatherData?.main.pressure} hPa
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Rain Volume</td>
                  <td className="px-4 py-2">
                    {weatherData?.rain?.["1h"] ?? 0} mm/h
                  </td>
                </tr>
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      )}
    </motion.main>
  );
}
