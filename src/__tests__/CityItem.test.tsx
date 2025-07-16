import { render, screen, waitFor } from '@testing-library/react'
import CityItem from '../components/home/city/CityItem'
import { useValueStore } from '@/lib/store'
import '@testing-library/jest-dom'
import { CityDetail } from '@/interface/city-detail'

jest.mock('@/lib/store')
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => <img {...props} />,
}))

jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }: any) => <a href={href}>{children}</a>,
}))

describe('CityItem', () => {
    const mockCityDetail = {
        id: "123",
        lat: "41.0000",
        lon: "85.0000",
        display_name: "Chicago, Chicago, Cook County, Illinois, 60605, USA",
        display_place: "Chicago",
        country_code: "us",
        weather: {
            coord: {
                lat: 41.0000,
                lon: 85.0000,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d"
                }
            ],
            base: "stations",
            main: {
                temp: 28.17,
                feels_like: 30.32,
                temp_min: 28.17,
                temp_max: 28.17,
                pressure: 1018,
                humidity: 65,
                sea_level: 1018,
                grnd_level: 996
            },
            visibility: 10000,
            wind: {
                speed: 2.42,
                deg: 144,
                gust: 3.93
            },
            clouds: {
                all: 0
            },
            dt: 1752592478,
            sys: {
                country: "US",
                sunrise: 1752575317,
                sunset: 1752629037
            },
            timezone: -18000,
            id: 4887398,
            name: "Chicago",
            cod: 200
        },
    } as CityDetail

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({
                    units: 'metric',
                })
            )
    })

    it('renders city title and weather data correctly', async () => {

        render(<CityItem cityDetail={mockCityDetail} />)

        await waitFor(() => {
            // city
            expect(screen.getByText(/Chicago, US/)).toBeInTheDocument()

            // local time
            expect(screen.getByText(/Local of City Time:/)).toBeInTheDocument()

            // temp
            expect(screen.getByText(/28.17/)).toBeInTheDocument()

            // lat ,long
            expect(screen.getByText(/Lat:/)).toBeInTheDocument()
            expect(screen.getByText(/41.0000/)).toBeInTheDocument()
            expect(screen.getByText(/Long:/)).toBeInTheDocument()
            expect(screen.getByText(/85.0000/)).toBeInTheDocument()
        })



        // see more details button
        const link = screen.getByRole('link', { name: /see more details/i })
        expect(link).toHaveAttribute('href', '/detail/123')
    })
})