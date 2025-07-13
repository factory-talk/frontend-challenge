'use client'
import { AutoComplete, AutoCompleteProps } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';
import { getLocations } from '@/hooks/get-location';
import { useValueStore } from '@/lib/store';
import { getWeather } from '@/hooks/get-weather';
import { getForecast } from '@/hooks/get-forecast';
import { WeatherDetail } from '@/interface/weather-detail';
import { SearchOptionData } from '@/interface/search-option';

function SearchBox() {
    const searchText = useValueStore((state) => state.searchText)
    const setSearchText = useValueStore((state) => state.setSearchText)

    const setWeatherDetails = useValueStore((state) => state.setWeatherDetails)

    const [options, setOptions] = useState<AutoCompleteProps['options']>([])

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearchText(value)
        }, 500),
        []
    );

    const handleFetch = async () => {
        const data = await getLocations({ dedupe: '1', limit: '20', q: searchText })
        const address = data ? data.map(({ display_name, lat, lon, display_place, place_id }) => ({
            value: display_name,
            lat,
            lon,
            display_place,
            id: place_id
        })) as SearchOptionData[] : []
        setOptions(address)
    }

    const onSelect = async (value: string) => {
        const selected = options?.find(opt => opt.value === value) as SearchOptionData
        if (selected) {
            const weather = await getWeather({
                lat: selected.lat,
                lon: selected.lon,
                units: 'metric'
            })

            const forecast = await getForecast({
                lat: selected.lat,
                lon: selected.lon,
                units: 'metric',
                cnt: '24'
            })
            const newData: WeatherDetail = {
                id: selected.id,
                weather: {
                    ...weather,
                    display_place: selected.display_place
                },
                forecast
            }

            setWeatherDetails(newData)
        }
    };

    useEffect(() => {
        if (searchText.length < 2) return
        handleFetch()
    }, [searchText])

    return (
        <AutoComplete
            prefix={<SearchOutlined className="pr-2" />}
            style={{ width: '100%', maxWidth: 500 }}
            onSearch={(text) => handleSearch(text)}
            onSelect={onSelect}
            options={options}
            placeholder="Search Location"
            size='large'
        />
    )
}

export default SearchBox