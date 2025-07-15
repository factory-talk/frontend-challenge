import { APP_CONFIG } from "@/config/app.config"

export const getWeatherImage = (image: string) => {
    return APP_CONFIG.NEXT_PUBLIC_WEATHER_IMAGE_URL!.replace('<imageId>', image)
}