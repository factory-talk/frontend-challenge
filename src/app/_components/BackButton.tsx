'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import React from 'react'

function BackButton() {

	const unit = useSearchParams().get('unit') || 'celsius';
	const country = useSearchParams().get('country') || 'all';

	return (
		<Link href={{ pathname: '/', query: { unit: unit, country: country } }}>
			<p className='text-blue-500 p-2 rounded-md cursor-pointer'>&lt; Back</p>
		</Link>
	)
}

export default BackButton