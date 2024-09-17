const RAPID_GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';
const OWM_API_URL = 'https://api.openweathermap.org/data/2.5';

const WEATHER_API_KEY = process.env.OWM_API_KEY;

const RAPID_GEO_API_OPTIONS: any = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.RAPID_GEO_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
};

export async function fetchAllWeatherData(lat: number, long: number) {
    try {
        let [weatherPromise, forcastPromise] = await Promise.all([
            fetch(
                `${OWM_API_URL}/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY}&units=metric`
            ),
            fetch(
                `${OWM_API_URL}/forecast?lat=${lat}&lon=${long}&exclude=daily,minutely,current,alerts&appid=${WEATHER_API_KEY}&units=metric`
            ),
        ]);

        const weatherResponse = await weatherPromise.json();
        const forcastResponse = await forcastPromise.json();
        return [weatherResponse, forcastResponse];
    } catch (error) {
        console.error(error);
    }
}

export async function fetchCities(input: string) {
    try {
        const response = await fetch(
            `${RAPID_GEO_API_URL}/cities?minPopulation=10000&namePrefix=${input}`,
            RAPID_GEO_API_OPTIONS
        );

        const cities = await response.json();
        for (const city of cities.data) {
            setTimeout(async function () {
                const cityTimeResponse = await fetch(
                    `${RAPID_GEO_API_URL}/cities/${city.id}/dateTime`,
                    RAPID_GEO_API_OPTIONS
                );
                const cityTime = await cityTimeResponse.json();

                city.currentTime = cityTime.data;
            }, 500);
        }
        return cities;
    } catch (error) {
        console.error(error);
        return;
    }
}