"use client";
import { useState } from "react";
import SearchInput from "../ui/searchInput";
import CityTable from "../ui/cityTable";
import Loading from "../ui/loading";
import SkeletonTable from "../ui/skeletonTable";
import rawCities from "../../data/city.list.json";
import { useRouter } from "next/navigation";
import { CityResponse } from "../../types/city";
import { useFetchGroupedWeatherData } from "../../hooks/useWeatherData";

export default function IndexPage() {
  const cities: CityResponse[] = rawCities as CityResponse[];
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [itemsPerPage] = useState(10);

  const { weatherData, loading, error, totalPages } = useFetchGroupedWeatherData(
    cities,
    currentPage,
    itemsPerPage,
    currentSearch
  );

  const paginate = (pageNumber: number, searchInput?: string) => {
    setCurrentSearch(searchInput ?? currentSearch);
    setCurrentPage(pageNumber);
  };

  const router = useRouter();

  const clickCity = (city: string) => {
    router.push(`/weather/${city}`);
  };

  const handleSearch = (query: string) => {
    paginate(1, query);
  };

  return (
    <div className="w-full">
      <SearchInput onSearch={handleSearch} />
      {error && <p className="text-red-700 font-bold mt-2 mb-5">{error}</p>}
      {loading ? (
        <div className="w-full max-w-md">
          <Loading />
          <SkeletonTable />
        </div>
      ) : (
        <CityTable
          cities={weatherData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPaginate={paginate}
          handleClick={clickCity}
        />
      )}
    </div>
  );
}
