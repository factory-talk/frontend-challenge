import { render, screen, waitFor } from '@testing-library/react'
import CityList from '../components/home/city/CityList'
import { useValueStore } from '@/lib/store'
import { getWeather } from '@/hooks/get-weather'
import { getForecast } from '@/hooks/get-forecast'
import { CityDetail } from '@/interface/city-detail'

jest.mock('@/lib/store')
jest.mock('@/hooks/get-weather')
jest.mock('@/hooks/get-forecast')

jest.mock('../components/home/city/CityItem', () => ({
    __esModule: true,
    default: ({ cityDetail }: { cityDetail: CityDetail }) => <div>{cityDetail.display_place}</div>,
}))

describe('CityList', () => {
    const mockSetCityListAll = jest.fn()

    const mockCityList = [
        {
            id: '1',
            lat: 13.75,
            lon: 100.5,
            display_place: 'Bangkok',
            country_code: 'th',
            weather: {},
            forecast: [],
        },
        {
            id: '2',
            lat: 35.68,
            lon: 139.76,
            display_place: 'Tokyo',
            country_code: 'jp',
            weather: {},
            forecast: [],
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks()

            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({
                    cityList: mockCityList,
                    fetchKey: 'abc123',
                    units: 'metric',
                    setCityListAll: mockSetCityListAll,
                })
            )

            ; (getWeather as jest.Mock).mockResolvedValue({ main: { temp: 30 } })
            ; (getForecast as jest.Mock).mockResolvedValue([{ dt: 1 }])
    })

    it('renders all city items', async () => {
        render(<CityList />)

        await waitFor(() => {
            expect(screen.getByText('Bangkok')).toBeInTheDocument()
            expect(screen.getByText('Tokyo')).toBeInTheDocument()
        })
    })

    it('fetches updated weather and forecast on mount', async () => {
        render(<CityList />)

        await waitFor(() => {
            expect(getWeather).toHaveBeenCalledTimes(2)
            expect(getForecast).toHaveBeenCalledTimes(2)
            expect(mockSetCityListAll).toHaveBeenCalledTimes(1)
            expect(mockSetCityListAll).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: '1',
                        weather: expect.anything(),
                        forecast: expect.anything(),
                    }),
                ])
            )
        })
    })

    it('alerts on fetch error', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => { })
            ; (getWeather as jest.Mock).mockRejectedValue(new Error('API failed'))

        render(<CityList />)

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith(expect.any(Error))
        })

        alertMock.mockRestore()
    })
})
