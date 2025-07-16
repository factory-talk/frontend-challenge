import { render, screen, fireEvent } from '@testing-library/react'
import CardTitle from '../components/home/city/CardTitle'
import { useValueStore } from '@/lib/store'

jest.mock('@/lib/store')

describe('CardTitle', () => {
    const mockDeleteCityList = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useValueStore as unknown as jest.Mock).mockImplementation((selector) =>
                selector({
                    deleteCityList: mockDeleteCityList,
                })
            )
    })

    it('renders the title correctly', () => {
        render(<CardTitle title="Bangkok" id="123" />)
        expect(screen.getByText('Bangkok')).toBeInTheDocument()
    })

    it('calls deleteCityList with correct id when delete icon is clicked', () => {
        render(<CardTitle title="Bangkok" id="123" />)

        const deleteIcon = screen.getByRole('img') // Ant Design icon is rendered as <svg role="img" />
        fireEvent.click(deleteIcon)

        expect(mockDeleteCityList).toHaveBeenCalledWith('123')
    })
})
