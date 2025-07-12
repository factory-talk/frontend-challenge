'use client'
import { AutoComplete, AutoCompleteProps } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';
import { getLocations } from '@/hooks/get-location';
import { useValueStore } from '@/lib/store';
import { getWeather } from '@/hooks/get-weather';
import { getForecast } from '@/hooks/get-forecast';

function SearchBox() {
    const searchText = useValueStore((state) => state.searchText)
    const setSearchText = useValueStore((state) => state.setSearchText)

    const setWeatherData = useValueStore((state) => state.setWeatherData)
    const setForecastData = useValueStore((state) => state.setForecastData)
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearchText(value)
        }, 500),
        []
    );

    const handleFetch = async () => {
        const data = await getLocations({ dedupe: '1', limit: '20', q: searchText })
        const address = data ? data.map(({ display_name, lat, lon, display_place }) => ({ value: display_name, lat, lon, display_place })) : []
        setOptions(address)
    }

    const onSelect = async (value: string) => {
        const selected = options?.find(opt => opt.value === value);
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

            setWeatherData({ ...weather, display_place: selected.display_place })
            setForecastData(forecast)
        }
        setSearchText(value)

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