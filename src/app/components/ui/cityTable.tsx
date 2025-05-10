import Image from "next/image";
import { GroupWeatherData } from "../../types/weather";
import { motion } from "framer-motion";
import {
  tableContainerVariants,
  tableItemVariants,
} from "../../utils/animations/motionConfig";

interface CityTableProps {
  cities: GroupWeatherData[];
  currentPage: number;
  totalPages: number;
  onPaginate: (page: number) => void;
  handleClick: (city: string) => void;
}

export default function CityTable({
  cities,
  currentPage,
  totalPages,
  onPaginate,
  handleClick,
}: CityTableProps) {
  const formatLocalTime = (timezoneOffsetInSeconds: number): string => {
    const nowUTC = new Date();
    const localTime = new Date(
      nowUTC.getTime() + timezoneOffsetInSeconds * 1000
    );
    return localTime.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <div className="w-full shadow-sm dark:bg-gray-800 dark:border-gray-700 max-w-md mx-auto">
        <div className="flow-root">
          <motion.ul
            className="divide-y divide-gray-200 dark:divide-gray-700"
            variants={tableContainerVariants}
            initial="initial"
            animate="animate"
          >
            {cities.map((city) => (
              <motion.li
                key={city.id}
                onClick={() => handleClick(city.name)}
                className="p-2 mb-2 bg-white/50 rounded-lg shadow-lg cursor-pointer hover:bg-white/70 transition"
                variants={tableItemVariants}
              >
                <div className="flex items-center">
                  <Image
                    src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt="weather icon"
                    width={50}
                    height={50}
                  />
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {city.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {formatLocalTime(city.sys.timezone || 0)}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base text-lg font-semibold text-gray-900 dark:text-white mr-5">
                    {city.main.temp}°
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 w-full max-w-md mx-auto">
        <button
          className={`p-2 rounded-full shadow flex items-center justify-center ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed opacity-50"
              : "bg-white/70 hover:bg-primary-light"
          }`}
          onClick={() => onPaginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-white text-sm font-medium">
          Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()}
        </span>
        <button
          className={`p-2 rounded-full shadow flex items-center justify-center ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed opacity-50"
              : "bg-white/70 hover:bg-primary-light"
          }`}
          onClick={() => onPaginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
