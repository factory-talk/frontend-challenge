// IndexPage.tsx
"use client";
import { useState } from "react";
import SearchInput from "../ui/searchInput";
import CityTable from "../ui/cityTable";
import Loading from "../ui/loading";
import SkeletonTable from "../ui/skeletonTable";
import AppHeader from "../ui/appHeader";
import ManageCityPopup from "../ui/manageCityPopup";
import rawCities from "../../data/city.list.json";
import { useRouter } from "next/navigation";
import { CityResponse } from "../../types/city";
import { useFetchGroupedWeatherData } from "../../hooks/useWeatherData";
import { useAddCityData } from "../../hooks/useCityData";
import { toast } from "../../utils/toast/toastHelper";
import { TABLE_ITEM_PER_PAGE } from "../../utils/config";

export default function IndexPage() {
  const cities: CityResponse[] = rawCities as CityResponse[];
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [itemsPerPage] = useState(TABLE_ITEM_PER_PAGE);

  const { weatherData, loading, error, totalPages } =
    useFetchGroupedWeatherData(
      cities,
      currentPage,
      itemsPerPage,
      currentSearch
    );

  const paginate = (pageNumber: number, searchInput?: string) => {
    setCurrentSearch(searchInput ?? currentSearch);
    setCurrentPage(pageNumber);
  };

  const { addCityData, loading: adding, error: addError } = useAddCityData();

  const router = useRouter();

  const clickCity = (city: string) => {
    router.push(`/weather/${city}`);
  };

  const handleSearch = (query: string) => {
    paginate(1, query);
  };

  const handleOpenAddPopup = () => {
    setShowAddPopup(true);
  };

  const handleSubmitAddPopup = async (cityValue: CityResponse) => {
    try {
      await addCityData(cityValue);
      toast.success("Successfully Added City.");
    } catch {
      toast.success(`Add failed: ${addError}`);
    }
    setShowAddPopup(false);
  };

  const handleCloseAddPopup = () => {
    setShowAddPopup(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AppHeader onClickAdd={handleOpenAddPopup} />
      <SearchInput onSearch={handleSearch} />
      {error && <p className="text-red-700 font-bold mt-2 mb-5">{error}</p>}
      {loading ? (
        <div className="w-full">
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
      <div className="w-full max-w-md flex items-center justify-end mb-5 relative">
        <div className="relative">
          <div className="fixed max-w-md top-0 mt-2 bg-white shadow-lg">
            <div className="absolute top-5 right-0">
              <ManageCityPopup
                showAddPopup={showAddPopup}
                onClose={handleCloseAddPopup}
                onConfirm={handleSubmitAddPopup}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
