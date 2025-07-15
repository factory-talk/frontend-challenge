'use client'
import { AutoComplete, AutoCompleteProps, Spin } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { SearchOutlined } from "@ant-design/icons";
import { debounce } from 'lodash';
import { getLocations } from '@/hooks/get-location';
import { useValueStore } from '@/lib/store';
import { getWeather } from '@/hooks/get-weather';
import { getForecast } from '@/hooks/get-forecast';
import { SearchOptionData } from '@/interface/search-option';
import { usePathname, useRouter } from 'next/navigation';

function SearchBox() {
    const pathname = usePathname()
    const router = useRouter()

    const [searchText, setSearchText] = useState('')
    const setCityList = useValueStore((state) => state.setCityList)
    const units = useValueStore((state) => state.units)
    const [loading, setLoading] = useState(false)


    const [options, setOptions] = useState<AutoCompleteProps['options']>([])

    const handleSearch = useCallback(
        debounce((value: string) => {
            setSearchText(value)
        }, 500),
        []
    );

    const handleFetch = async () => {
        setLoading(true)
        const data = await getLocations({ dedupe: '1', limit: '20', q: searchText })
        const address = data ? data.map((item) => ({
            ...item,
            value: item.display_name,
            id: item.place_id,
        })) as SearchOptionData[] : []
        setOptions(address)
        setLoading(false)
    }

    const onSelect = async (value: string) => {
        const location = options?.find(opt => opt.value === value) as SearchOptionData
        if (location) {

            const [weather, forecast] = await Promise.all([
                getWeather({
                    lat: location.lat,
                    lon: location.lon,
                    units: units
                }),
                getForecast({
                    lat: location.lat,
                    lon: location.lon,
                    units: units,
                    cnt: '24'
                })
            ])

            setCityList({
                id: location.place_id,
                lat: location.lat,
                lon: location.lon,
                display_name: location.display_name,
                display_place: location.display_place,
                country_code: location.address.country_code,
                weather,
                forecast
            })
        }
        if (pathname.startsWith('/detail/')) {
            router.push('/')
        }
    };

    useEffect(() => {
        if (searchText.length < 2) return
        handleFetch()
    }, [searchText, units])

    return (
        <AutoComplete
            prefix={<SearchOutlined className="pr-2" />}
            style={{ width: '100%', maxWidth: 500 }}
            onSearch={(text) => handleSearch(text)}
            onSelect={onSelect}
            options={options}
            placeholder="Search Location"
            size='large'
            notFoundContent={loading ? <Spin size="small" /> : 'No results'}
        />
    )
}

export default SearchBox