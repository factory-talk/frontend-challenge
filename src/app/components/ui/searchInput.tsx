import { useState, useEffect } from "react";
import { useSearchCityData } from "../../hooks/useCityData";
import { CityResponse } from "../../types/city";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [search, setSearch] = useState<string>("");
  const [suggestions, setSuggestions] = useState<CityResponse[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const { searchCityData } = useSearchCityData();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      const res = await searchCityData(search);
      setSuggestions(res);
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (city: CityResponse) => {
    setSearch(city.name);
    setShowSuggestions(false);
    onSearch(city.name);
  };

  const handleSearchSubmit = () => {
    setShowSuggestions(false);
    onSearch(search);
  };

  return (
    <form
      className="relative mx-auto mb-5 w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchSubmit();
      }}
    >
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Search for a city..."
        className="form-input h-11 w-full rounded-lg bg-white/80 shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider"
      />

      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary-light"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="11.5"
            cy="11.5"
            r="9.5"
            stroke="currentColor"
            strokeWidth="2.5"
            opacity="0.5"
          ></circle>
          <path
            d="M18.5 18.5L22 22"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          ></path>
        </svg>
      </button>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border">
          {suggestions.map((city) => (
            <li
              key={city.id}
              onClick={() => handleSuggestionClick(city)}
              className="cursor-pointer px-4 py-2 bg-gray-200 hover:bg-gray-100"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
