'use client'
import { Skeleton } from 'antd';


export const WeatherItemDetailSkeleton = () => {

    return (
        <div className='flex justify-center flex-col items-center'>
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                <Skeleton active paragraph={{ rows: 20 }} />
            </div>
        </div>
    )
}