import { render } from '@testing-library/react'
import { WeatherItemDetailSkeleton } from '@/components/home/WeatherItemDetailSkeleton'
import '@testing-library/jest-dom'

describe('WeatherItemDetailSkeleton', () => {
    it('renders skeleton component correctly', () => {
        const { container } = render(<WeatherItemDetailSkeleton />)

        const skeletonTitle = container.querySelector('.ant-skeleton-title')
        expect(skeletonTitle).toBeInTheDocument()
    })
})
