const WeatherItem = () => {
    return (
        <>
            <div className="w-full grid grid-cols-4 grid-rows-2 py-2">
                <div className="px-4">New York</div>
                <div className="col-start-3 row-span-2 text-center">ICON</div>
                <div className="row-span-2 text-center">18</div>
                <div className="px-4">5:30AM</div>
            </div>
        </>

    )
}

export default WeatherItem