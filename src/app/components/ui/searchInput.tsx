"use client";
import { useState } from "react";

interface SearchInputProps {
  onSearch: (query: string) => void;
}

export default function SearchInput({ onSearch }: SearchInputProps) {
  const [search, setSearch] = useState<string>("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = () => {
    onSearch(search);
  };

  return (
    <form
      className="mx-auto mb-5 w-full max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        handleSearchSubmit();
      }}
    >
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search for a city..."
          className="form-input h-11 rounded-lg bg-white/80 shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full p-0"
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
              strokeWidth="1.5"
              opacity="0.5"
            ></circle>
            <path
              d="M18.5 18.5L22 22"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            ></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
