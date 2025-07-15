import { Units } from '@/interface/units'
import { useValueStore } from '@/lib/store'
import { Radio } from 'antd'

const groupItem: { label: string, value: Units }[] = [
    {
        label: 'Fahrenheit',
        value: 'imperial'
    },
    {
        label: 'Celsius',
        value: 'metric'
    },
    {
        label: 'Kelvin',
        value: 'standard'
    },
]

function UnitsToggle() {

    const setUnits = useValueStore((state) => state.setUnits)
    const units = useValueStore((state) => state.units)
    const setFetchKey = useValueStore((state) => state.setFetchKey)

    const handleChangeUnit = (value: Units) => {
        setUnits(value)
        setFetchKey()
    }


    return (
        <div className='flex items-center gap-3 max-w-[500]'>
            <div>
                Units:
            </div>
            <Radio.Group value={units}>
                {
                    groupItem.map((item, i) => (
                        <Radio.Button key={i} value={item.value} onClick={() => handleChangeUnit(item.value)}>{item.label}</Radio.Button>
                    ))
                }
            </Radio.Group>
        </div>
    )
}

export default UnitsToggle