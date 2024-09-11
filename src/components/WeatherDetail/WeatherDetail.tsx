import ForcastList from "../ForcastList"

const WeatherDetail = () => {
    return (
        <>
        <div className="grid grid-rows-3 m-2">
                <h1 className="text-3xl font-bold">New York</h1>
                <p className="text-base font-bold">Thursday, 22 May 2019</p>
                <p className="text-gray-500 text-sm">Min 15°, Max 25°</p>
            </div>
            <div className="grid place-items-center">
                <p>ICON</p>
                <span className="text-8xl md:text-9xl font-bold">18°</span>
                <p className="text-xl mt-2">Clear</p>
            </div>
            <ForcastList />
            <div className="grid grid-cols-2 gap-4 bg-white m-5">
                <div className="text-center">
                    <p className="text-gray-500">Humidity</p>
                    <p className="font-bold">65%</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Wind</p>
                    <p className="font-bold">11 km/h</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Pressure</p>
                    <p className="font-bold">1,010 mBar</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-500">Chance of Rain</p>
                    <p className="font-bold">30%</p>
                </div>
            </div>
        </>
    )
}

export default WeatherDetail