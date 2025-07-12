/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_FORECAST_URL: process.env.NEXT_PUBLIC_FORECAST_URL,
        NEXT_PUBLIC_LACATION_URL: process.env.NEXT_PUBLIC_LACATION_URL,
        NEXT_PUBLIC_WEATHER_URL: process.env.NEXT_PUBLIC_WEATHER_URL
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'openweathermap.org',
                port: '',
                pathname: '/img/wn/**',
            },
        ],
    },
};

export default nextConfig;
