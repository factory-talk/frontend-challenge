import { render } from '@testing-library/react'
import WeatherDetailPage from '../app/(home)/weather/[city]/page'
import { getWeatherDetail } from '../app/(home)/weather/actions'

jest.mock('../app/(home)/weather/actions', () => ({
  getWeatherDetail: jest.fn(),
}))

jest.mock('../app/(home)/components/WeatherDetail', () => ({ weatherDetail }: any) => (
  <div>Mock Weather Detail for {weatherDetail.name}</div>
))
 const mockData = {
      name: 'Bangkok',
      main: { temp: 300, temp_min: 295, temp_max: 305, humidity: 80, pressure: 1000 },
      weather: [{ main: 'Clouds' }],
      wind: { speed: 10 },
      clouds: { all: 60 },
      sys: {},
    }
describe('WeatherDetailPage', () => {
  it('renders weather detail for city', async () => {
   

    (getWeatherDetail as jest.Mock).mockResolvedValueOnce(mockData)

    const { findByText } = render(
      await WeatherDetailPage({ params: Promise.resolve({ city: 'Bangkok' }) })
    )

    expect(await findByText('Mock Weather Detail for Bangkok')).toBeInTheDocument()
  })
})
