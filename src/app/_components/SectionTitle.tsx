import React from 'react'

function SectionTitle({title}: {title: string}) {
	return (
		<h2 className='text-xs uppercase text-gray-500 font-bold self-start'>{title}</h2>
	)
}

export default SectionTitle