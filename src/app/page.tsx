"use client"
import SearchBar from "src/components/SearchBar";
import WeatherItemList from "src/components/WeatherItemList";
import React, { useState } from "react";
import ActiveSearchResponse from "src/interfaces/ActiveSearch/ActiveSearchResponse";


export default function Home() {
  const [selecedtActiveSearch, setSelectedActiveSearch] = useState<ActiveSearchResponse>()
  return (
    <>
      <SearchBar setSelectedActiveSearch={setSelectedActiveSearch} />
      <WeatherItemList activeSearch={selecedtActiveSearch} />
    </>
  );
}
