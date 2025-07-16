import { render, screen } from '@testing-library/react'
import HourlyForecast from '../components/home/HourlyForcast'
import { useValueStore } from '@/lib/store'
import '@testing-library/jest-dom'
import { ForecastData } from '@/interface/response/forecast-resp'

jest.mock('@/lib/store')

// Mock utilities
jest.mock('@/util/convert-date', () => ({
    convertTimeHour: (dt: number) => `11:00 PM`,
}))
jest.mock('@/util/convert-unit', () => ({
    convertUnits: () => '°C',
}))
jest.mock('@/util/getweather-image', () => ({
    getWeatherImage: () => '/icon.png',
}))

jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}))

describe('HourlyForecast', () => {
    beforeEach(() => {
        jest.clearAllMocks()
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({ units: 'metric' })
            )
    })

    const mockForecastData: ForecastData[] = [
        {
            dt: 1752595200,
            main: {
                temp: 30.00,
                feels_like: 35.89,
                temp_min: 30.11,
                temp_max: 30.45,
                pressure: 1006,
                sea_level: 1006,
                grnd_level: 1006,
                humidity: 69,
                temp_kf: 0.34
            },
            weather: [
                {
                    id: 804,
                    main: "Clouds",
                    description: "overcast clouds",
                    icon: "04n"
                }
            ],
            clouds: {
                all: 100
            },
            wind: {
                speed: 5.65,
                deg: 176,
                gust: 11.37
            },
            visibility: 10000,
            pop: 0,
            sys: {
                pod: "n"
            },
            dt_txt: "2025-07-15 16:00:00"
        },
        {
            dt: 1752598800,
            main: {
                temp: 28.00,
                feels_like: 35.38,
                temp_min: 29.56,
                temp_max: 30.14,
                pressure: 1006,
                sea_level: 1006,
                grnd_level: 1006,
                humidity: 70,
                temp_kf: 0.58
            },
            weather: [
                {
                    id: 804,
                    main: "Clouds",
                    description: "overcast clouds",
                    icon: "04n"
                }
            ],
            clouds: {
                all: 100
            },
            wind: {
                speed: 5.75,
                deg: 174,
                gust: 10.87
            },
            visibility: 10000,
            pop: 0,
            sys: {
                pod: "n"
            },
            dt_txt: "2025-07-15 17:00:00"
        }
    ]

    it('renders title and forecast items', () => {
        render(<HourlyForecast forecastData={mockForecastData} />)

        // Title
        expect(screen.getByText(/24-Hour Forecast/i)).toBeInTheDocument()

        // time
        expect(screen.getAllByText('11:00 PM')[0]).toBeInTheDocument()
        expect(screen.getByText('30°C')).toBeInTheDocument()

        // forecast icon
        const images = screen.getAllByAltText('forecast-icon')
        expect(images).toHaveLength(2)
        expect(images[0]).toHaveAttribute('src', '/icon.png')
    })

    it('renders nothing if forecastData is empty', () => {
        render(<HourlyForecast forecastData={[]} />)

        expect(screen.getByText(/24-Hour Forecast/i)).toBeInTheDocument()
        expect(screen.queryByAltText('forecast-icon')).not.toBeInTheDocument()
    })
})
