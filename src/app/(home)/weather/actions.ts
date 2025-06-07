'use server'

import axiosInstance from "src/utils/axios"
import { WeatherResponse } from "./type"

export async function getWeatherDetail( city:string): Promise<WeatherResponse> {
 
  try {
    const req = await axiosInstance.get<WeatherResponse>(`?q=${city}`)
    return req?.data
  } catch (error) {
    console.error(error)
    return error
  }
}
