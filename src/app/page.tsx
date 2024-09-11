"use client"
import SearchBar from "src/components/SearchBar";
import WeatherItemList from "src/components/WeatherItemList";
import React, { useState } from "react";
import ActiveSearch from "src/interfaces/ActiveSearch";


export default function Home() {
  const [selecedtActiveSearch, setSelectedActiveSearch] = useState<ActiveSearch>()
  return (
    <>
      <SearchBar setSelectedActiveSearch={setSelectedActiveSearch}/>
      <WeatherItemList activeSearch={selecedtActiveSearch} />
    </>
  );
}
