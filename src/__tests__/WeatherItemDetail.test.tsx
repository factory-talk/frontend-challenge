import { render, screen, fireEvent } from '@testing-library/react'
import { WeatherItemDetail } from '@/components/home/WeatherItemDetail'
import '@testing-library/jest-dom'
import { useValueStore } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { WeatherDetail } from '@/interface/weather-detail'

jest.mock('@/lib/store')
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('@/util/convert-date', () => ({
    convertDatetimeFormat: () => 'Tuesday, July 15, 2025',
    convertLocalTime: () => '11:00 PM',
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

jest.mock('@/components/home/HourlyForcast', () => ({
    __esModule: true,
    default: () => <div data-testid="hourly-forecast">Hourly Forecast</div>,
}))

describe('WeatherItemDetail', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({ units: 'metric' })
            )
    })

    const mockWeatherDetail = {
        id: '1',
        weather: {
            display_place: 'bangkok',
            sys: { country: 'TH' },
            dt: 1721050000,
            timezone: 25200,
            main: {
                temp: 32,
                temp_max: 34,
                temp_min: 28,
                humidity: 80,
                pressure: 1008,
            },
            wind: {
                speed: 3.2,
            },
            rain: {
                '1h': 1.5,
            },
            weather: [
                {
                    icon: '01d',
                    description: 'clear sky',
                },
            ],
        },
        forecast: [
            {
                dt: 1721053600,
                main: { temp: 30 },
                weather: [{ icon: '01d' }],
            },
        ],
    } as WeatherDetail

    it('renders weather details correctly', () => {
        render(<WeatherItemDetail weatherDetail={mockWeatherDetail} />)

        // city ,country
        expect(screen.getByText(/bangkok, TH/i)).toBeInTheDocument()

        // date
        expect(screen.getByText('Tuesday, July 15, 2025')).toBeInTheDocument()

        // time
        expect(screen.getByText('11:00 PM')).toBeInTheDocument()

        // temp info
        expect(screen.getByText('32°C')).toBeInTheDocument()
        expect(screen.getByText('H: 34°C L: 28°C')).toBeInTheDocument()

        // description
        expect(screen.getByText('clear sky')).toBeInTheDocument()

        // info
        expect(screen.getByText('80%')).toBeInTheDocument()
        expect(screen.getByText('3.2 m/s')).toBeInTheDocument()
        expect(screen.getByText('1008 hPa')).toBeInTheDocument()
        expect(screen.getByText('1.5 mm')).toBeInTheDocument()

        // Hourly Forecast
        expect(screen.getByTestId('hourly-forecast')).toBeInTheDocument()
    })

    it('navigates back when back button is clicked', () => {
        render(<WeatherItemDetail weatherDetail={mockWeatherDetail} />)

        const backButton = screen.getByRole('button')
        fireEvent.click(backButton)

        expect(mockPush).toHaveBeenCalledWith('/')
    })
})
