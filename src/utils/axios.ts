import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_WEATHER_URL,
})

// blocked by cors move to nextjs backend
axiosInstance.interceptors.request.use(
  (config) => {

    config.params = {
      ...config.params,
      appid: process.env.NEXT_PUBLIC_APP_ID  ,
      limit: process.env.NEXT_PUBLIC_LIMIT || 5,
    }

    config.headers['appid'] =  process.env.NEXT_PUBLIC_APP_ID  
    config.headers['limit'] =  process.env.NEXT_PUBLIC_LIMIT
    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
