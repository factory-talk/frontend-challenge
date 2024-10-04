import React from 'react'
import { render, screen } from '@testing-library/react'
import WeatherDetail from './WeatherDetail'
import { WeatherData } from '../../_lib/models'

const mockWeatherData: WeatherData = {
  main: {
    humidity: 80,
    pressure: 1012,
    temp: 293.15,
    temp_max: 295.15,
    temp_min: 291.15,
    feels_like: 293.15,
  },
  wind: {
    speed: 5.1,
    deg: 200,
  },
  clouds: {
    all: 90,
  },
  rain: {
    '1h': 0.25,
  },
  visibility: 10000,
  snow: {
    '1h': 0.25,
  },
  timezone: 0,
  cod: 200,
  coord: {
    lon: 0,
    lat: 0,
  },
  id: 1,
  name: 'Test City',
  weather: [
    {
      id: 801,
      main: 'Clouds',
      description: 'few clouds',
      icon: '02d',
    },
  ],
	forecasts: [],
	dt: 1,
}

describe('WeatherDetail', () => {
  it('renders weather details correctly', () => {
    render(<WeatherDetail weather={mockWeatherData} />)

    expect(screen.getByText('Humidity:')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()

    expect(screen.getByText('Wind:')).toBeInTheDocument()
    expect(screen.getByText('5.1')).toBeInTheDocument()

    expect(screen.getByText('Pressure:')).toBeInTheDocument()
    expect(screen.getByText('1012')).toBeInTheDocument()

    expect(screen.getByText('Chance of rain:')).toBeInTheDocument()
    expect(screen.getByText('0.25')).toBeInTheDocument()

    expect(screen.getByText('Clouds:')).toBeInTheDocument()
    expect(screen.getByText('90')).toBeInTheDocument()
  });
})