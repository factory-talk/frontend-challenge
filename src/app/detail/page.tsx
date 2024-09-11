"use client"
import SearchBar from "src/components/SearchBar"
import WeatherDetail from "src/components/WeatherDetail/WeatherDetail"
import React, { useState  } from "react"
import ActiveSearchResponse from "src/interfaces/ActiveSearch/ActiveSearchResponse"

const Detail = () => {

    const [selecedtActiveSearch, setSelectedActiveSearch] = useState<ActiveSearchResponse>()

    return (
        <>
            <SearchBar setSelectedActiveSearch={setSelectedActiveSearch} />
            <WeatherDetail />
        </>
    )
}

export default Detail