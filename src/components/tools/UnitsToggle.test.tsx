import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UnitsToggle from './UnitsToggle'
import { useValueStore } from '@/lib/store'

jest.mock('@/lib/store', () => ({
    useValueStore: jest.fn(),
}))

describe('UnitsToggle', () => {
    const mockSetUnits = jest.fn()
    const mockSetFetchKey = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({
                    units: 'metric',
                    setUnits: mockSetUnits,
                    setFetchKey: mockSetFetchKey,
                })
            )
    })

    it('renders all unit options', () => {
        render(<UnitsToggle />)
        expect(screen.getByText(/Units:/i)).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: /Fahrenheit/i })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: /Celsius/i })).toBeInTheDocument()
        expect(screen.getByRole('radio', { name: /Kelvin/i })).toBeInTheDocument()
    })

    it('has correct default selected value', () => {
        render(<UnitsToggle />)
        const selected = screen.getByRole('radio', { name: /Celsius/i }) as HTMLInputElement
        expect(selected.checked).toBe(true)
    })

    it('calls setUnits and setFetchKey when a unit is clicked', async () => {
        render(<UnitsToggle />)
        const user = userEvent.setup()

        const kelvinButton = screen.getByText(/Kelvin/i)
        await user.click(kelvinButton)

        expect(mockSetUnits).toHaveBeenCalledWith('standard')
        expect(mockSetFetchKey).toHaveBeenCalled()
    })

})
