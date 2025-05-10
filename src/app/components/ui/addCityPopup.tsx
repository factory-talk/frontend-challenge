import { useState, useEffect, useRef } from "react";
import rawCities from "../../data/city.list.json";
import { manualFetchDetailWeatherData } from "../../hooks/useWeatherData";
import { CityResponse } from "../../types/city";

interface AddPopupProps {
  showAddPopup: boolean;
  onClose: () => void;
  onConfirm: (cityValue: CityResponse) => void;
}

const citySet = new Set(rawCities.map((city) => city.name.toLowerCase()));

export default function AddPopup({
  showAddPopup,
  onClose,
  onConfirm,
}: AddPopupProps) {
  const [inputValue, setInputValue] = useState("");
  const [cityValue, setCityValue] = useState({} as CityResponse);
  const [isValid, setIsValid] = useState(false);
  const [validationError, setValidationError] = useState("");
  const popupAddRef = useRef<HTMLDivElement>(null);

  const { loading, error, fetchWeather } = manualFetchDetailWeatherData();

  const handleClickCloseAdd = (event: MouseEvent) => {
    if (
      popupAddRef.current &&
      !popupAddRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  useEffect(() => {
    if (showAddPopup) {
      document.addEventListener("mousedown", handleClickCloseAdd);
    } else {
      document.removeEventListener("mousedown", handleClickCloseAdd);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickCloseAdd);
    };
  }, [showAddPopup]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsValid(false);
  };

  const handleConfirm = () => {
    if (isValid) {
      onConfirm(cityValue);
      setInputValue("");
      setIsValid(false);
    }
  };

  const checkDuplicated = (name: string): boolean => {
    if (!name) return false;
    return !citySet.has(name.trim().toLowerCase());
  };

  const checkOpenWeather = async (name: string): Promise<boolean> => {
    try {
      const data = await fetchWeather(name);
      if (!data?.id) return false;
      const payload = {
        id: data.id,
        name: data.name,
        state: "",
        country: "",
        coord: {
          lon: data.coord.lon,
          lat: data.coord.lat,
        },
      };
      setCityValue(payload);
      return true;
    } catch {
      return false;
    }
  };

  const handleValidate = async () => {
    const isNotDuplicate = checkDuplicated(inputValue);
    const existsInWeather = await checkOpenWeather(inputValue);
    const isInputValid = isNotDuplicate && existsInWeather;
    setIsValid(isInputValid);

    let errorMessage = "";
    if (!inputValue.trim()) {
      errorMessage = "Please enter a city name.";
    } else if (!isNotDuplicate) {
      errorMessage = "This city is already added.";
    } else if (!existsInWeather) {
      errorMessage = "City not found in weather data.";
      
}

setValidationError(errorMessage);
  };

  if (!showAddPopup) return null;

  return (
    <div
      ref={popupAddRef}
      className="fixed top-5 right-5 w-60 p-4 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
    >
      {validationError && (
        <span className="text-sm text-red-500">{validationError}</span>
      )}
      <div className="flex justify-between items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter city name"
        />
        <button
          onClick={handleValidate}
          className={`p-2 rounded-md ${
            isValid ? "bg-green-500" : "bg-danger"
          } text-white`}
        >
          {isValid ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          )}
        </button>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 rounded-md text-white ${
            isValid ? "bg-blue-500" : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!isValid}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
