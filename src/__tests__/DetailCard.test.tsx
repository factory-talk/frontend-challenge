import { render, waitFor } from '@testing-library/react'
import DetailCard from '../components/detail/DetailCard'
import { useValueStore } from '@/lib/store'
import * as nextNavigation from 'next/navigation'
import * as getWeatherApi from '@/hooks/get-weather'
import * as getForecastApi from '@/hooks/get-forecast'

jest.mock('@/lib/store')
jest.mock('@/hooks/get-weather')
jest.mock('@/hooks/get-forecast')
jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}))

const mockSetWeatherDetail = jest.fn()

const cityMock = {
    id: '123',
    lat: 10,
    lon: 20,
    display_place: 'Bangkok',
}

describe('DetailCard', () => {
    beforeEach(() => {
        jest.clearAllMocks()

            // mock useParams
            ; (nextNavigation.useParams as jest.Mock).mockReturnValue({ id: '123' })

            // mock zustand store
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({
                    weatherDetail: null,
                    setWeatherDetail: mockSetWeatherDetail,
                    cityList: [cityMock],
                    units: 'metric',
                })
            )
    })

    it('renders loading state', async () => {
        (getWeatherApi.getWeather as jest.Mock).mockResolvedValue({});
        (getForecastApi.getForecast as jest.Mock).mockResolvedValue([]);

        const { container } = render(<DetailCard />)

        const skeletonTitle = container.querySelector('.ant-skeleton-title')
        expect(skeletonTitle).toBeInTheDocument()
    })


    it('does nothing when city not found', async () => {
        (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                weatherDetail: null,
                setWeatherDetail: mockSetWeatherDetail,
                cityList: [], // ไม่เจอ city
                units: 'metric',
            })
        )

        render(<DetailCard />)

        await waitFor(() => {
            expect(mockSetWeatherDetail).not.toHaveBeenCalled()
        })
    })

    it('handles error during fetch', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { })

            ; (getWeatherApi.getWeather as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))
            ; (getForecastApi.getForecast as jest.Mock).mockResolvedValue([])

        render(<DetailCard />)

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(expect.any(Error))
        })

        alertMock.mockRestore()
    })
})
