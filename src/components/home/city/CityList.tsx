'use client'
import React from 'react'
import CityItem from './CityItem'
import { useValueStore } from '@/lib/store'

function CityList() {
    const cityList = useValueStore((state) => state.cityList)


    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {
                cityList.map((item, key) => (
                    <div key={'ct' + key} className='py-2 flex justify-center'>
                        <CityItem key={'cti' + key} cityDetail={item} />
                    </div>
                ))
            }
        </div>
    )
}

export default CityList