// src/app/api/city/route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
console.log('heeeeeapi');
  const appid = process.env.APP_ID 
  const limit = process.env.LIMIT
const url = process.env.API_CITY_URL || ""
  try {
    const res = await axios.get(url, {
      params: {
        q,
        appid,
        limit,
      },
    })

    return NextResponse.json(res.data)
  } catch (err) {
    console.error('OpenCityMap error:', err)
    return NextResponse.json({ error: 'Failed to fetch city data' }, { status: 500 })
  }
}
