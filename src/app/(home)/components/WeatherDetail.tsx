'use client'

import React from 'react'

import { WeatherResponse } from '../weather/type'

type Props = {
  weatherDetail: WeatherResponse
}

export default function WeatherDetail({ weatherDetail }: Props) {
  const {
    name,
    main,
    weather,
    wind,
    sys,
  } = weatherDetail

  const currentTemp = Math.round(main.temp - 273.15) // Kelvin to °C
  const minTemp = Math.round(main.temp_min - 273.15)
  const maxTemp = Math.round(main.temp_max - 273.15)
  const description = weather[0]?.main || '-'

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm text-gray-500">{today}</p>
        <p className="text-sm text-gray-500">MIN {minTemp}°, MAX {maxTemp}°</p>
      </div>

      {/* Current temp */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-2" />
        <h2 className="text-6xl font-bold">{currentTemp}°</h2>
        <p className="text-lg text-gray-700 mt-1">{description}</p>
      </div>

      {/* Hourly Forecast (Mocked) */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">24 HOURS FORECAST</h3>
        <div className="flex justify-between text-center text-sm text-gray-700">
            {/* # make api call for real forecast later */}
          {[
            { time: '8 AM', temp: 18 },
            { time: '11 AM', temp: 22 },
            { time: '2 PM', temp: 25 },
            { time: '5 PM', temp: 21 },
            { time: '8 PM', temp: 18 },
            { time: '11 PM', temp: 15 },
          ].map((item, idx) => (
            <div key={idx}>
              <div className="w-8 h-8 mx-auto bg-gray-200 rounded-full mb-1" />
              <p>{item.time}</p>
              <p>{item.temp}°</p>
            </div>
          ))}
        </div>
      </div>

      {/* Current Details */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">CURRENT DETAILS</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>Humidity: {main.humidity}%</li>
          <li>Wind: {wind.speed} km/h</li>
          <li>Pressure: {main.pressure.toLocaleString()} mBar</li>
          <li>Chance of rain: {weatherDetail.clouds.all}%</li>
        </ul>
      </div>
    </div>
  )
}
