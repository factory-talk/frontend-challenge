const CityCard = ({item}:{item:any})=>{

console.log("item",item)
    return (
        <div>
            GGGGG{item?.name}
            GGGGG{item?.lat}
            GGGGG{item?.long}
        </div>
    )
}


export {CityCard}
