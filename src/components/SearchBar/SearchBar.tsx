"use client"
import React, { useState, useEffect, useCallback } from "react"
import ActiveSearchResponse from "src/interfaces/ActiveSearch/ActiveSearchResponse"
import SearchBarProp from "src/interfaces/SearchBarProps"
import { debounce } from "lodash"

const SearchBar: React.FC<SearchBarProp> = ({ setSelectedActiveSearch }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [activeSearches, setActiveSearches] = useState<ActiveSearchResponse[]>([])

  useEffect(() => {
    if (isFocused) {
      document.body.classList.add('dimmed-background');
    } else {
      document.body.classList.remove('dimmed-background');
    }
    return () => {
      document.body.classList.remove('dimmed-background');
    };
  }, [isFocused]);

  const handleSelect = (activeSearch: ActiveSearchResponse): void => {
    setSelectedActiveSearch(activeSearch)
  }

  const handleFocus = (): void => {
    setIsFocused(true);
  }

  const handleBlur = (): void => {
    setIsFocused(false)
  }

  const debouncedFetchLocations = useCallback(
    debounce((keyword: string) => fetchLocations(keyword), 500),
    []
  );

  const fetchLocations = async (keyword: string): Promise<void> => {
    if (!keyword) {
      setActiveSearches([]);
      return;
    }
    const locationRes = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${keyword}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
    );
    const locations: ActiveSearchResponse[] = await locationRes.json();
    setActiveSearches(locations);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const keyword: string = event.target.value
    setSearchKeyword(keyword)
    debouncedFetchLocations(keyword)
  }

  return (
    <>
      <div className="relative lg:p-2 p-2 sm:p-2 dark:bg-gray-700">
        <div className="absolute inset-y-0 start-1 flex items-center ps-3 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </div>
        <input type="text" id="default-search"
          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
          autoComplete="off"
          placeholder="Search places"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleSearch}
          value={searchKeyword}
          required />
        <div className="absolute inset-y-0 end-5 flex items-center ps-3 pointer-events-none">
          <div className="inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-gray-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>
      </div>
      {
        activeSearches.length > 0 && isFocused && (
          <div className="absolute top-18 bg-white text-black w-full flex flex-col rounded">
            {
              activeSearches.map((activeSearch, index) => (
                <div
                  className="flex flex-row p-4 border-b border-slate-600 hover:bg-gray-100 cursor-pointer"
                  key={index}
                  onMouseDown={() => {
                    handleSelect(activeSearch)
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  {activeSearch.name}, {activeSearch.country}
                </div>
              ))
            }
          </div>
        )
      }
    </>
  )
}

export default SearchBar