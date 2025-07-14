'use client'
import { useValueStore } from "@/lib/store";
import { DeleteOutlined } from "@ant-design/icons";

function CardTitle({ title, id }: { title: string, id: string }) {
    const deleteCityList = useValueStore((state) => state.deleteCityList)

    const handleRemove = (value: string) => {
        deleteCityList(value)
    }
    return (
        <div className='flex justify-between'>
            <span>{title}</span>
            <DeleteOutlined className='text-lg hover:text-red-400 cursor-pointer' onClick={() => handleRemove(id)} />
        </div>
    )
}

export default CardTitle