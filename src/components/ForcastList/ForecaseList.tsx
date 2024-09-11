import ForecastItem from "../ForecastItem"
import ForecastItemProps from "../../interfaces/ForecastItemProp"

const mock: ForecastItemProps[] = [
    {
        dateTime: new Date(),
        icon: "asdl",
        temp: 2
    },
    {
        dateTime: new Date(),
        icon: "adadasdas",
        temp: 5
    },
    {
        dateTime: new Date(),
        icon: "asdl",
        temp: 2
    },
    {
        dateTime: new Date(),
        icon: "adadasdas",
        temp: 5
    },
    {
        dateTime: new Date(),
        icon: "asdl",
        temp: 2
    },
    {
        dateTime: new Date(),
        icon: "adadasdas",
        temp: 5
    }
]

const ForecastList = () => {
    return (
        <>
            <div className="text-xs m-4 text-gray-500">24 Hours Forecast</div>
            <div className="grid grid-cols-6 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5 text-center">
                {
                    mock.map((props, index) => (
                        <ForecastItem key={index} dateTime={props.dateTime} temp={props.temp} icon={props.icon}  />
                    ))
                }
            </div>
        </>
    )
}

export default ForecastList