'use server'

import axiosInstance from "src/utils/axios"
import { WeatherResponse } from "./type"



export async function getWeatherDetail( city:string): Promise<WeatherResponse> {
 
    console.log('city => ', city)
  try {
    const req = await axiosInstance.get<WeatherResponse>(`?q=${city}`)
    // console.log('req => ', req)
    console.log('data => ', req.data)
    return req.data
  } catch (error) {
    console.error(error)
    return error
  }
}
