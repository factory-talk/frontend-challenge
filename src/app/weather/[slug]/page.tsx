"use client";
import Image from "next/image";
import TopNavigator from "../../components/ui/topNavigator";
import SkeletionDetail from "../../components/ui/skeletionDetail";
import ErrorBox from "../../components/ui/errorBox";
import Loading from "../../components/ui/loading";
import ConfirmPopup from "../../components/ui/confirmPopup";
import { useRouter } from "next/navigation";
import { useFetchDetailWeatherData } from "../../hooks/useWeatherData";
import { motion } from "framer-motion";
import { pageVariants, fadeInUp } from "../../lib/animations/motionConfig";
import { useState } from "react";

type Props = {
  params: { slug: string };
};

export default function WeatherPage({ params }: Props) {
  const [showConfirmPopup, setShowConfirmPopup] = useState({ visible: false, width: 0, height: 0 });

  const { slug } = params;
  const { weatherData, loading, error } = useFetchDetailWeatherData(slug);
  
  const decodedSlug = decodeURIComponent(slug);
  const router = useRouter();

  const handleBack = () => {
    router.push(`/`);
  };
  
  const handleDeleteClick = () => {
    if (window.innerWidth && window.innerHeight) {
      setShowConfirmPopup({
        visible: true,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  };

  const handleConfirmDelete = () => {
    // handle delete logic
    setShowConfirmPopup({ visible : false, width: 0, height: 0 });
  };

  const handleCancelDelete = () => {
    setShowConfirmPopup({ visible: false, width: 0, height: 0 });
  };

  return (
    <>
      <ConfirmPopup
        title="Confirm Delete"
        message="Are you sure you want to delete these entries? You can't undo this action."
        showConfirmPopup={showConfirmPopup}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
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

            <motion.div className="mb-4" custom={2} variants={fadeInUp}>
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
                    <td className="px-4 py-2">
                      {weatherData?.main.temp_min} K
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-2">Max Temperature</td>
                    <td className="px-4 py-2">
                      {weatherData?.main.temp_max} K
                    </td>
                  </tr>
                  <tr className="bg-gray-50 border-t">
                    <td className="px-4 py-2">Weather</td>
                    <td className="px-4 py-2">
                      {weatherData?.weather[0].main}
                    </td>
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
                    <td className="px-4 py-2">
                      {weatherData?.main.humidity} %
                    </td>
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
            <motion.div
              className="flex justify-between p-5 w-full"
              custom={4}
              variants={fadeInUp}
            >
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 p-0 hover:bg-primary-light transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary"
                >
                  <path
                    d="M16.5 3.5L20.5 7.5C21.5 8.5 21.5 10.5 20.5 11.5L12 19L5 19L5 12L14.5 3.5C15.5 2.5 17.5 2.5 18.5 3.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </button>

              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 p-0 hover:bg-red-200 transition-all"
                onClick={handleDeleteClick}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-danger"
                >
                  <path
                    d="M19 6H5M19 6L18.25 19.5C18.15 20.3 17.56 21 16.74 21H7.26C6.44 21 5.85 20.3 5.75 19.5L5 6M10 6V4C10 3.44772 10.4477 3 11 3H13C13.5523 3 14 3.44772 14 4V6M9 6H15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </motion.main>
    </>
  );
}
