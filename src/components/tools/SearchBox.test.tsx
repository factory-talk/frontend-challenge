import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import SearchBox from './SearchBox'
import { useValueStore } from '@/lib/store'
import { useRouter, usePathname } from 'next/navigation'
import { getLocations } from '@/hooks/get-location'
import { getWeather } from '@/hooks/get-weather'
import { getForecast } from '@/hooks/get-forecast'
import userEvent from '@testing-library/user-event'
import { ForecastData } from '@/interface/response/forecast-resp'

jest.mock('@/lib/store')
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
}))

jest.mock('@/hooks/get-location', () => ({
    getLocations: jest.fn()
}))

jest.mock('@/hooks/get-weather', () => ({
    getWeather: jest.fn()
}))

jest.mock('@/hooks/get-forecast', () => ({
    getForecast: jest.fn()
}))

jest.mock('@/lib/store', () => {
    const actual = jest.requireActual('zustand')
    return {
        useValueStore: jest.fn(),
    }
})

describe('SearchBox', () => {
    const mockSetCityList = jest.fn()
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks();

        (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
            selector({
                units: 'metric',
                setCityList: mockSetCityList,
            })
        );
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (usePathname as jest.Mock).mockReturnValue('/');
    })

    it('renders input and placeholder', () => {
        render(<SearchBox />)

        const input = screen.getByRole('combobox')
        expect(input).toBeInTheDocument()
    })

    it('calls getLocations on typing', async () => {
        ; (getLocations as jest.Mock).mockResolvedValue([])

        render(<SearchBox />)

        const input = screen.getByRole('combobox')

        fireEvent.change(input, { target: { value: 'bangkok' } })

        // ต้องรอ debounce และ useEffect ทำงาน
        await waitFor(() => {
            expect(getLocations).toHaveBeenCalledWith({
                dedupe: '1',
                limit: '20',
                q: 'bangkok',
            })
        })
    })

})