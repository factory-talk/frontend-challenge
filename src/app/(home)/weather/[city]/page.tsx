// 'use client'
// import { useParams } from "next/navigation"


// const weatherCity = ()=>{
// const {city} = useParams()

//     return (
//         <div>
//             {city}
//         </div>
//     )
// }

// export default weatherCity

import WeatherDetail from '../../components/WeatherDetail'
import { getWeatherDetail, 

} from '../actions'

export default async function WeatherDetailPage({
  params,
}: Readonly<{ params: Promise<{ city: string }> }>) {
  const { city } = await params
  
  const weatherDetail =await 
    getWeatherDetail(city)

  

  return (
    <main>
      <WeatherDetail 
      weatherDetail={weatherDetail}
       />
    </main>
  )
}





